import React, { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Cat from "./Cat";

const links = [
  ["menu", "Меню"],
  ["story", "Наш мир"],
  ["evenings", "События"],
  ["visit", "Где мы"],
];

export default function Header({ count, onCartOpen }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;

    const update = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`,
      );
    };

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

    const closeOutside = (event) => {
      if (!headerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const viewport = matchMedia("(min-width: 561px)");

    const closeOnResize = () => {
      if (viewport.matches) setOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    viewport.addEventListener("change", closeOnResize);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      viewport.removeEventListener("change", closeOnResize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="header"
    >
      <a
        className="brand"
        href="#"
        onClick={() => setOpen(false)}
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
        {links.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="cart-button"
          onClick={() => {
            setOpen(false);
            onCartOpen();
          }}
          aria-label={`Открыть заказ, ${count} блюд`}
        >
          <ShoppingBag size={19} />
          <span>{count}</span>
        </button>

        <button
          ref={toggleRef}
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
