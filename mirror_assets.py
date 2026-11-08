#!/usr/bin/env python3
"""Best-effort offline asset mirroring for an already-downloaded static Nuxt site.

Only downloads publicly accessible assets. Does not circumvent a 403, auth, or licensing.
Never rewrites a URL unless its file was downloaded successfully.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import html
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen

ORIGIN = "https://planeteno-food-station.sunilnathyogi008.workers.dev/"
ORIGIN_HOST = urlsplit(ORIGIN).hostname
ALLOW_HOSTS = {ORIGIN_HOST, "a.storyblok.com"}
TEXT_EXTS = {".html", ".css", ".js", ".mjs", ".json", ".svg", ".webmanifest"}
ASSET_EXTS = {".js", ".mjs", ".css", ".json", ".svg", ".png", ".jpg",
              ".jpeg", ".webp", ".avif", ".gif", ".ico", ".woff",
              ".woff2", ".ttf", ".otf", ".mp3", ".ogg", ".wav", ".mp4",
              ".webm", ".riv", ".glb", ".gltf", ".bin", ".wasm", ".ktx2",
              ".hdr", ".webmanifest"}
EXTERNAL = re.compile(r"https?:(?:\\*/){2}[^\s\"'<>`\\{}()\[\],;]+")
ROOT_ASSET = re.compile(r'''["'`](/(?:_nuxt|images|fonts|three|draco|lottie|assets|audio|sounds|rive\.riv)[^"'`<>\s]*)["'`]''')
SKIP_DIRS = {".git", "node_modules", ".nuxt", ".output", ".asset-backup"}
MAX_SIZE = 80 * 1024 * 1024


def clean(raw: str) -> str:
    return html.unescape(raw.replace("\\/", "/")).rstrip(".\\")


def accepted(u: str) -> bool:
    p = urlsplit(u)
    return p.scheme in ("http", "https") and p.hostname in ALLOW_HOSTS and (
        Path(p.path.lower()).suffix in ASSET_EXTS
        or (p.hostname == "a.storyblok.com" and p.path.startswith("/f/"))
    )


def relative_path(path: str) -> Path | None:
    parts = PurePosixPath(unquote(path).lstrip("/")).parts
    if not parts or any(x in (".", "..") for x in parts):
        return None
    return Path(*parts)


def destination(root: Path, url: str):
    parsed = urlsplit(url)
    rel = relative_path(parsed.path)
    if rel is None:
        return None
    if parsed.hostname != ORIGIN_HOST:
        rel = Path("external") / parsed.hostname / rel
        if parsed.query:
            suffix = hashlib.sha256(parsed.query.encode()).hexdigest()[:10]
            rel = rel.with_name(rel.stem + "__" + suffix + rel.suffix)
    path = (root / rel).resolve()
    if not path.is_relative_to(root):
        return None
    return path, "/" + rel.as_posix()


def all_text_files(root: Path):
    for p in root.rglob("*"):
        if (p.is_file() and p.suffix.lower() in TEXT_EXTS
                and not any(part in SKIP_DIRS for part in p.relative_to(root).parts)
                and p.stat().st_size <= 35 * 1024 * 1024):
            yield p


def gather(root: Path, include_metadata: bool):
    urls = set()
    for file in all_text_files(root):
        try:
            src = file.read_text("utf-8")
        except (UnicodeError, OSError):
            continue
        for m in EXTERNAL.finditer(src):
            url = clean(m.group())
            if not accepted(url):
                continue
            # These belong to the earlier Galaxy site's meta and favicon,
            # and are not needed for the visible restaurant UI.
            if not include_metadata and urlsplit(url).path.startswith("/f/s-snathyogi/"):
                continue
            urls.add(url)
        for m in ROOT_ASSET.finditer(src):
            raw = html.unescape(m.group(1))
            if Path(urlsplit(raw).path).suffix.lower() in ASSET_EXTS:
                urls.add(urljoin(ORIGIN, raw))
    return urls


def download(url: str, root: Path, timeout: int):
    result = destination(root, url)
    if not result:
        return (url, None, "invalid destination")
    target, local = result
    if target.is_file() and target.stat().st_size:
        return url, local, "existing"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36",
        "Referer": ORIGIN,
        "Accept": "*/*",
    }
    try:
        with urlopen(Request(url, headers=headers), timeout=timeout) as response:
            if response.headers.get("Content-Length") and int(response.headers["Content-Length"]) > MAX_SIZE:
                return url, None, "too large"
            mime = response.headers.get("Content-Type", "").lower()
            if mime.startswith("text/html") and target.suffix.lower() not in (".html", ".htm"):
                return url, None, "HTML instead of asset"
            target.parent.mkdir(parents=True, exist_ok=True)
            fd, temp_name = tempfile.mkstemp(dir=target.parent, prefix=".asset-")
            try:
                with os.fdopen(fd, "wb") as stream:
                    total = 0
                    while True:
                        chunk = response.read(256 * 1024)
                        if not chunk:
                            break
                        total += len(chunk)
                        if total > MAX_SIZE:
                            raise ValueError("over size limit")
                        stream.write(chunk)
                os.replace(temp_name, target)
            finally:
                if os.path.exists(temp_name):
                    os.unlink(temp_name)
        return url, local, "downloaded"
    except HTTPError as exc:
        return url, None, f"HTTP {exc.code}"
    except (URLError, TimeoutError, OSError, ValueError) as exc:
        return url, None, str(exc)


def main():
    parser = argparse.ArgumentParser(description="Mirror accessible assets without rebuilding Nuxt")
    parser.add_argument("project", nargs="?", default=".")
    parser.add_argument("--timeout", type=int, default=10)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--include-metadata", action="store_true", help="Try old Galaxy OG images and favicons (may be HTTP 403)")
    args = parser.parse_args()
    root = Path(args.project).expanduser().resolve()
    if not (root / "index.html").is_file():
        parser.error(f"index.html not found in {root}")

    completed = {}
    failed = {}
    skipped = set()
    for stage in range(4):
        candidates = gather(root, args.include_metadata)
        new = set()
        for url in candidates:
            if url in completed or url in failed:
                continue
            info = destination(root, url)
            if info is None:
                skipped.add(url)
                continue
            # A mirrored root asset already in place needs no URL rewrite.
            new.add(url)
        print(f"Pass {stage + 1}: {len(new)} assets to check", flush=True)
        if not new:
            break
        with ThreadPoolExecutor(max_workers=max(1, min(args.workers, 12))) as pool:
            futures = {pool.submit(download, url, root, max(2, args.timeout)): url for url in sorted(new)}
            for future in as_completed(futures):
                url, local, status = future.result()
                if local is not None:
                    completed[url] = local
                    if status == "downloaded":
                        print(f"  OK   {url} -> {local}", flush=True)
                else:
                    failed[url] = status
                    print(f"  SKIP {status:12} {url}", flush=True)

    backup = root / ".asset-backup" / time.strftime("%Y%m%d-%H%M%S")
    changed = 0
    # Patching only downloaded remote links; root-relative links already resolve locally.
    for file in all_text_files(root):
        try:
            before = file.read_text("utf-8")
        except (UnicodeError, OSError):
            continue
        after = before
        for m in EXTERNAL.finditer(before):
            raw = m.group()
            local = completed.get(clean(raw))
            if local and local != raw:
                after = after.replace(raw, local)
        if after != before:
            copy = backup / file.relative_to(root)
            copy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, copy)
            file.write_text(after, encoding="utf-8")
            changed += 1

    report = {"mirrored": completed, "unavailable": failed,
              "skipped": sorted(skipped), "modified_files": changed}
    (root / "mirror-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    (root / "missing-assets.txt").write_text("\n".join(f"{v}\t{k}" for k, v in sorted(failed.items())), encoding="utf-8")
    print(f"\nDONE. Assets available locally: {len(completed)}; blocked/missing: {len(failed)}; files patched: {changed}")
    print("Report: mirror-report.json; failures: missing-assets.txt")
    if changed:
        print(f"Backup: {backup}")
    print("WARNING: dynamically constructed URLs and any 403 resources remain external.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
