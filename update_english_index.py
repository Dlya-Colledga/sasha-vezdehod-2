#!/usr/bin/env python3
"""Update only the contact heading and six fictional Bishkek location cards.

Works directly with the prebuilt root index.html (Nuxt SSR + __NUXT_DATA__).
Does not translate any other text, edit source components or contact an API.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

FOOTER_TEXT = "We look forward to welcoming you at one of our locations."
CITY = "Bishkek"

# Demonstration addresses only. They are not verified real restaurants.
# Existing location names remain exactly as they are in the original website.
ADDRESSES = {
    "Noctis ArCH": ("Kyivskaya St.", "184"),
    "AethEr POint": ("Chuy Ave.", "156"),
    "Lyra HAlo": ("Toktogul St.", "112"),
    "Orion Gate": ("Baytik Baatyr St.", "37"),
    "DracOnis Eye": ("Isanov St.", "59"),
    "Australis Veil": ("Akhunbaev St.", "121"),
}

NUXT_BLOCK = re.compile(
    r'(?P<start><script\b(?=[^>]*\bid=["\']__NUXT_DATA__["\'])[^>]*>)'
    r'(?P<json>[\s\S]*?)'
    r'(?P<end></script\s*>)',
    re.IGNORECASE,
)
FOOTER_BLOCK = re.compile(
    r'(?P<open><h2\b(?=[^>]*\bclass="[^"]*section-contacts__title)[^>]*>)'
    r'(?P<body>[\s\S]*?)'
    r'(?P<close></h2\s*>)',
    re.IGNORECASE,
)


def ref_object(values: list, ref: object, kind: type):
    if type(ref) is not int or not (0 <= ref < len(values)):
        raise ValueError(f"Invalid Nuxt reference: {ref}")
    result = values[ref]
    if not isinstance(result, kind):
        raise ValueError(f"Nuxt reference {ref} is not {kind.__name__}")
    return result


def ref_string(values: list, ref: object) -> str:
    return ref_object(values, ref, str)


def find_component(values: list, name: str) -> dict:
    matches = []
    for value in values:
        if not isinstance(value, dict) or type(value.get("component")) is not int:
            continue
        if ref_string(values, value["component"]) == name:
            matches.append(value)
    if len(matches) != 1:
        raise ValueError(f"Expected one component '{name}', found {len(matches)}")
    return matches[0]


def change_footer_data(values: list, changes: dict[int, object]) -> None:
    contacts = find_component(values, "section-contacts")
    rich_text = ref_object(values, contacts["title"], dict)
    paragraphs_ref = rich_text["content"]
    paragraphs = ref_object(values, paragraphs_ref, list)
    if not paragraphs:
        raise ValueError("The contact heading contains no paragraphs")

    first_paragraph = ref_object(values, paragraphs[0], dict)
    first_texts = ref_object(values, first_paragraph["content"], list)
    if not first_texts:
        raise ValueError("The first contact paragraph is empty")
    first_text = ref_object(values, first_texts[0], dict)
    text_ref = first_text.get("text")
    ref_string(values, text_ref)

    changes[text_ref] = FOOTER_TEXT
    changes[paragraphs_ref] = [paragraphs[0]]


def change_location_data(values: list, changes: dict[int, object]) -> None:
    locations = find_component(values, "section-location")
    marker_refs = []
    for key in ("markers_north", "markers_south"):
        marker_refs.extend(ref_object(values, locations[key], list))
    if len(marker_refs) != len(ADDRESSES):
        raise ValueError(f"Expected {len(ADDRESSES)} location markers, found {len(marker_refs)}")

    names_seen: set[str] = set()
    value_refs_seen: set[int] = set()
    labels = ("City", "Street", "Building")
    old_labels = (("Distance", "City"), ("Ra", "Street"), ("Dec", "Building"))

    for marker_ref in marker_refs:
        marker = ref_object(values, marker_ref, dict)
        name = ref_string(values, marker["title"])
        if name not in ADDRESSES:
            raise ValueError(f"Unknown location: {name!r}. Use an original English index.html.")
        if name in names_seen:
            raise ValueError(f"Duplicate location marker: {name}")
        names_seen.add(name)

        street, building = ADDRESSES[name]
        data = ref_object(values, marker["data"], dict)
        rows = ref_object(values, data["tbody"], list)
        if len(rows) != 3:
            raise ValueError(f"Location {name} has {len(rows)} table rows instead of 3")

        for row_ref, expected, new_label, new_value in zip(
            rows, old_labels, labels, (CITY, street, building)
        ):
            row = ref_object(values, row_ref, dict)
            cells = ref_object(values, row["body"], list)
            if len(cells) != 2:
                raise ValueError(f"Location {name} contains a nonstandard table row")

            label_cell = ref_object(values, cells[0], dict)
            value_cell = ref_object(values, cells[1], dict)
            label_ref, value_ref = label_cell["value"], value_cell["value"]
            old_label = ref_string(values, label_ref)
            ref_string(values, value_ref)
            if old_label not in expected:
                raise ValueError(f"Unexpected label '{old_label}' in {name}")
            if value_ref in value_refs_seen:
                raise ValueError("Two location values share one Nuxt reference")
            value_refs_seen.add(value_ref)
            changes[label_ref] = new_label
            changes[value_ref] = new_value

    if names_seen != ADDRESSES.keys():
        raise ValueError("Missing some of the six location markers")


def element_spans(payload: str) -> list[tuple[int, int]]:
    """Return offsets of the top-level JSON array items, preserving all other bytes."""
    n = len(payload)
    i = 0
    while i < n and payload[i].isspace():
        i += 1
    if i >= n or payload[i] != "[":
        raise ValueError("Nuxt data must be a JSON array")
    i += 1
    spans: list[tuple[int, int]] = []

    while True:
        while i < n and payload[i].isspace():
            i += 1
        if i >= n:
            raise ValueError("Unexpected end of JSON array")
        if payload[i] == "]":
            break

        start = i
        depth = 0
        quoted = False
        escaped = False
        while i < n:
            char = payload[i]
            if quoted:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == '"':
                    quoted = False
            elif char == '"':
                quoted = True
            elif char in "[{":
                depth += 1
            elif char in "]}":
                if depth == 0:
                    if char != "]":
                        raise ValueError("Invalid JSON nesting")
                    break
                depth -= 1
            elif char == "," and depth == 0:
                break
            i += 1

        spans.append((start, i))
        if i < n and payload[i] == ",":
            i += 1
            continue
        if i < n and payload[i] == "]":
            break
        raise ValueError("Invalid Nuxt JSON format")
    return spans


def replace_nuxt_data(source: str) -> tuple[str, int]:
    matches = list(NUXT_BLOCK.finditer(source))
    if len(matches) != 1:
        raise ValueError("Expected exactly one __NUXT_DATA__ script in index.html")
    match = matches[0]
    raw_json = match.group("json")
    values = json.loads(raw_json)
    if not isinstance(values, list):
        raise ValueError("Unexpected Nuxt data structure")

    changes: dict[int, object] = {}
    change_footer_data(values, changes)
    change_location_data(values, changes)

    spans = element_spans(raw_json)
    if len(spans) != len(values):
        raise ValueError("Nuxt JSON elements and offsets do not match")
    actual = 0
    for ref in sorted(changes, reverse=True):
        new_value = changes[ref]
        if values[ref] == new_value:
            continue
        a, b = spans[ref]
        encoded = json.dumps(new_value, ensure_ascii=False, separators=(",", ":"))
        encoded = encoded.replace("<", "\\u003C")
        raw_json = raw_json[:a] + encoded + raw_json[b:]
        actual += 1

    result = source[:match.start("json")] + raw_json + source[match.end("json"):]
    return result, actual


def replace_footer_html(source: str) -> str:
    matches = list(FOOTER_BLOCK.finditer(source))
    if len(matches) != 1:
        raise ValueError("Could not find the contacts heading in index.html")
    match = matches[0]
    rich_text = re.search(r'<span\b[^>]*\bclass="rich-text"[^>]*>', match.group("body"), re.I | re.S)
    if not rich_text:
        raise ValueError("The contacts heading has no rich-text wrapper")
    new_body = (
        rich_text.group(0)
        + '<p textAlign="null"><span style="color: ">'
        + html.escape(FOOTER_TEXT)
        + '</span></p></span>'
    )
    return source[:match.start("body")] + new_body + source[match.end("body"):]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Update only the English footer and six Bishkek addresses in index.html"
    )
    parser.add_argument(
        "html", nargs="?", type=Path, default=Path(__file__).with_name("index.html"),
        help="Path to the original English index.html (defaults to a file next to this script)",
    )
    args = parser.parse_args()
    path = args.html.expanduser().resolve()
    if not path.is_file():
        parser.error(f"File not found: {path}")

    original = path.read_text(encoding="utf-8")
    if 'id="ru-localization-runtime"' in original or re.search(r'<html\b[^>]*lang="ru"', original, re.I):
        parser.error("Use the original English index.html, not the previously translated Russian version")

    try:
        updated, changed = replace_nuxt_data(original)
        updated = replace_footer_html(updated)
    except (ValueError, KeyError, IndexError, TypeError) as error:
        parser.error(str(error))

    if updated == original:
        print("Already updated. Nothing changed.")
        return

    backup = path.with_name("index.english.original.html")
    if not backup.exists():
        backup.write_text(original, encoding="utf-8")
    path.write_text(updated, encoding="utf-8")
    print(f"Updated: {path}")
    print("Changed: English contact heading and six fictional Bishkek addresses")
    print(f"Nuxt values updated: {changed}")
    print("All other website text remains unchanged")
    print(f"Backup: {backup}")


if __name__ == "__main__":
    main()
