import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, ReceiptText, X } from "lucide-react";
import Cat from "./Cat";

const links = [
  ["/#story", "Наш мир"],
  ["/#evenings", "События"],
  ["/#visit", "Где мы"],
];

export default function Header({ route, onNavigate, activeOrders }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;

    const update = () =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`,
      );

    update();

    const observer = new ResizeObserver(update);
    observer.observe(header);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const outside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const viewport = matchMedia("(min-width: 701px)");

    const resize = () => {
      if (viewport.matches) setOpen(false);
    };

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    viewport.addEventListener("change", resize);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      viewport.removeEventListener("change", resize);
    };
  }, [open]);

  const go = (event, href) => {
    setOpen(false);
    onNavigate(event, href);
  };

  return (
    <header
      ref={headerRef}
      className="header neko-header"
    >
      <a
        className="brand"
        href="/"
        onClick={(event) => go(event, "/")}
        aria-label="NEKO YORU — на главную"
      >
        <Cat />

        <span>
          NEKO YORU
          <small>РАМЭН · АНИМЕ · ЛЮБОВЬ</small>
        </span>
      </a>

      <nav
        id="main-navigation"
        aria-label="Основная навигация"
        className={`nav ${open ? "open" : ""}`}
      >
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            onClick={(event) => go(event, href)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions neko-header-actions">
        <a
          href="/order"
          className={`header-orders-link ${
            route === "/order" ? "selected" : ""
          }`}
          aria-current={route === "/order" ? "page" : undefined}
          aria-label={`Мои заказы${
            activeOrders ? `, активных: ${activeOrders}` : ""
          }`}
          onClick={(event) => go(event, "/order")}
        >
          <ReceiptText
            size={18}
            strokeWidth={1.8}
          />

          <span className="header-orders-text">Мои заказы</span>

          {activeOrders > 0 && (
            <span className="header-orders-count">{activeOrders}</span>
          )}
        </a>

        <a
          href="/menu"
          className={`header-menu-cta ${route === "/menu" ? "selected" : ""}`}
          aria-current={route === "/menu" ? "page" : undefined}
          onClick={(event) => go(event, "/menu")}
        >
          Меню <ArrowUpRight size={18} />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="icon-button mobile-toggle"
          aria-label={open ? "Закрыть навигацию" : "Открыть навигацию"}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
