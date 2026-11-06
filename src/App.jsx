import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Check, Sparkles } from "lucide-react";

import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";

import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuPage from "./components/MenuPage";
import MenuSection from "./components/MenuSection";
import MenuDialogs from "./components/MenuDialogs";
import ContentSections from "./components/ContentSections";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import Recommendations from "./components/Recommendations";
import FloatingCart from "./components/FloatingCart";
import OrdersPage from "./components/OrdersPage";
import { EventsPage } from "./components/Events";

const getRoute = () => {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  return ["/", "/menu", "/order", "/events"].includes(pathname)
    ? pathname
    : "/";
};

const canAnimate = () =>
  typeof document.startViewTransition === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToTarget(hash) {
  if (!hash) {
    window.scrollTo(0, 0);
    return;
  }

  const element = document.getElementById(decodeURIComponent(hash.slice(1)));

  if (element) {
    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  } else {
    window.scrollTo(0, 0);
  }
}

export default function App() {
  const model = useCart();
  const orderModel = useOrders();

  const [route, setRoute] = useState(getRoute);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
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
  }, [route]);

  useEffect(() => {
    document.title =
      route === "/events"
        ? "События — NEKO YORU"
        : route === "/order"
          ? "Мои заказы — NEKO YORU"
          : route === "/menu"
            ? "Меню — NEKO YORU"
            : "NEKO YORU — твоя маленькая Япония";
  }, [route]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const swapRoute = (nextRoute, hash = "") => {
    const update = () => {
      flushSync(() => {
        setRoute(nextRoute);
        setDialog(null);
      });

      window.scrollTo(0, 0);
    };

    if (canAnimate()) {
      const transition = document.startViewTransition(update);

      transition.finished.then(
        () => {
          if (hash) scrollToTarget(hash);
        },
        () => {
          if (hash) scrollToTarget(hash);
        },
      );
    } else {
      update();

      if (hash) {
        requestAnimationFrame(() => scrollToTarget(hash));
      }
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const nextRoute = getRoute();

      if (nextRoute === route) {
        scrollToTarget(window.location.hash);
      } else {
        swapRoute(nextRoute, window.location.hash);
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [route]);

  const navigate = (event, destination) => {
    if (
      event?.defaultPrevented ||
      (event &&
        (event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey))
    ) {
      return;
    }

    event?.preventDefault();

    const next = new URL(destination, window.location.origin);

    if (next.origin !== window.location.origin) {
      window.location.assign(next.href);
      return;
    }

    const nextRoute = ["/menu", "/order", "/events"].includes(
      next.pathname.replace(/\/+$/, ""),
    )
      ? next.pathname.replace(/\/+$/, "")
      : "/";

    const nextUrl = `${next.pathname}${next.search}${next.hash}`;

    if (
      `${window.location.pathname}${window.location.search}${window.location.hash}` !==
      nextUrl
    ) {
      window.history.pushState({}, "", nextUrl);
    }

    if (nextRoute === route) {
      setDialog(null);
      scrollToTarget(next.hash);
    } else {
      swapRoute(nextRoute, next.hash);
    }
  };

  const notify = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
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

  const menuProps = {
    cart: model.cart,
    maxQuantity: model.maxQuantity,
    onAdd: add,
    onDetailOpen: (dish) => setDialog({ type: "dish", dish }),
    onMoodOpen: openMood,
  };

  const placeOrder = (customer) => {
    const order = orderModel.createOrder(model.cart, customer);

    if (!order) return false;

    model.clear();
    setDialog(null);
    navigate(null, "/order");

    return true;
  };

  return (
    <>
      <Header
        route={route}
        onNavigate={navigate}
        activeOrders={orderModel.activeCount}
      />

      <main
        className={`page-shell is-${
          route === "/" ? "home" : route.slice(1)
        }-route`}
        key={route}
      >
        {route === "/events" ? (
          <EventsPage onNavigate={navigate} />
        ) : route === "/order" ? (
          <OrdersPage
            orders={orderModel.orders}
            now={orderModel.now}
            onNavigate={navigate}
          />
        ) : route === "/menu" ? (
          <>
            <MenuPage onNavigate={navigate} />

            <MenuSection
              {...menuProps}
              fullMenu
            />

            <section className="menu-signoff">
              <div
                className="menu-signoff-ornament"
                aria-hidden="true"
              >
                ✳
              </div>

              <span className="eyebrow">ЕЩЁ НЕ ОПРЕДЕЛИЛСЯ?</span>

              <h2>
                У каждого настроения <span className="serif">свой вкус.</span>
              </h2>

              <p>
                Нэко поможет найти именно твоё блюдо. Доверься маленькой магии.
              </p>

              <button
                className="button coral"
                onClick={openMood}
              >
                Подобрать блюдо <Sparkles size={17} />
              </button>
            </section>
          </>
        ) : (
          <>
            <Hero onNavigate={navigate} />
            <Recommendations onNavigate={navigate} />

            <ContentSections
              onMoodOpen={() => navigate(null, "/menu")}
              onNavigate={navigate}
            />
          </>
        )}
      </main>

      {route === "/menu" && (
        <FloatingCart
          count={model.count}
          onClick={() => setDialog({ type: "cart" })}
        />
      )}

      <Footer
        notify={notify}
        onNavigate={navigate}
      />

      <div
        className={`toast ${toast ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={17} />
        {toast}
      </div>

      <MenuDialogs
        cart={model.cart}
        maxQuantity={model.maxQuantity}
        onAdd={add}
        dialog={dialog}
        onClose={() => setDialog(null)}
      />

      <CartModal
        open={dialog?.type === "cart"}
        model={model}
        onClose={() => setDialog(null)}
        onPlace={placeOrder}
      />
    </>
  );
}
