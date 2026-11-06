import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "./hooks/useCart";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import MenuDialogs from "./components/MenuDialogs";
import ContentSections from "./components/ContentSections";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";

export default function App() {
  const model = useCart();
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.removeItem("neko-bookings");
    } catch {}

    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  const notify = (text) => {
    clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  const add = (id) => {
    if ((model.cart[id] || 0) >= model.maxQuantity) {
      notify(
        `Можно добавить не больше ${model.maxQuantity} порций одного блюда`,
      );
      return;
    }

    model.change(id, 1);
    notify("Вкусная история добавлена в заказ");
  };

  const openMood = () => setDialog({ type: "mood" });
  const closeDialog = () => setDialog(null);

  const menuProps = {
    cart: model.cart,
    maxQuantity: model.maxQuantity,
    onAdd: add,
  };

  return (
    <>
      <Header
        count={model.count}
        onCartOpen={() => setDialog({ type: "cart" })}
      />

      <main>
        <Hero />

        <MenuSection
          {...menuProps}
          onMoodOpen={openMood}
          onDetailOpen={(dish) => setDialog({ type: "dish", dish })}
        />

        <ContentSections onMoodOpen={openMood} />
      </main>

      <Footer notify={notify} />

      <div
        className={`toast ${toast ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={17} />
        {toast}
      </div>

      <MenuDialogs
        {...menuProps}
        dialog={dialog}
        onClose={closeDialog}
      />

      <CartModal
        open={dialog?.type === "cart"}
        onClose={closeDialog}
        model={model}
      />
    </>
  );
}
