import { useCallback, useEffect, useState } from "react";
import { dishes } from "../data/menu";

const ORDERS_KEY = "neko-orders-v1";
const CONTACT_KEY = "neko-delivery-contact";

export const STAGE_SECONDS = [0, 20, 40, 65];

export const ORDER_STAGES = [
  {
    title: "Заказ принят",
    description: "Твоя вкусная история уже на кухне.",
  },
  {
    title: "Хайтатсунин собирает вашу еду",
    description: "Блюда готовятся и аккуратно упаковываются.",
  },
  {
    title: "Хайтатсунин в пути",
    description: "Самая вкусная часть истории уже близко.",
  },
  {
    title: "Доставлено",
    description: "Вкусная глава завершена. Итадакимас!",
  },
];

function readOrders() {
  try {
    const value = JSON.parse(localStorage.getItem(ORDERS_KEY));

    if (!Array.isArray(value)) return [];

    return value
      .filter(
        (order) =>
          order &&
          typeof order.id === "string" &&
          Number.isFinite(order.createdAt) &&
          Array.isArray(order.items) &&
          order.items.length > 0 &&
          Number.isFinite(order.total) &&
          typeof order.customer?.name === "string" &&
          typeof order.customer?.address === "string" &&
          typeof order.customer?.phone === "string",
      )
      .slice(0, 100);
  } catch {
    return [];
  }
}

export function readSavedContact() {
  try {
    const value = JSON.parse(localStorage.getItem(CONTACT_KEY));

    return value && typeof value === "object"
      ? {
          name: String(value.name || ""),
          phone: String(value.phone || ""),
          address: String(value.address || ""),
          comment: "",
        }
      : { name: "", phone: "", address: "", comment: "" };
  } catch {
    return { name: "", phone: "", address: "", comment: "" };
  }
}

export function getOrderStage(order, now = Date.now()) {
  const elapsed = Math.max(0, (now - order.createdAt) / 1000);

  if (elapsed >= STAGE_SECONDS[3]) return 3;
  if (elapsed >= STAGE_SECONDS[2]) return 2;
  if (elapsed >= STAGE_SECONDS[1]) return 1;

  return 0;
}

export function secondsToNextStage(order, now = Date.now()) {
  const stage = getOrderStage(order, now);

  if (stage === 3) return 0;

  return Math.max(
    0,
    Math.ceil(STAGE_SECONDS[stage + 1] - (now - order.createdAt) / 1000),
  );
}

export function useOrders() {
  const [orders, setOrders] = useState(readOrders);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);

    const onStorage = (event) => {
      if (event.key === ORDERS_KEY) setOrders(readOrders());
    };

    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const createOrder = useCallback((cart, customer) => {
    const items = dishes
      .filter((dish) => cart[dish.id])
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        image: dish.image,
        price: dish.price,
        quantity: cart[dish.id],
      }));

    if (!items.length) return null;

    const order = {
      id: `NY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      createdAt: Date.now(),
      customer,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    setOrders((current) => [order, ...current].slice(0, 100));

    try {
      localStorage.setItem(
        CONTACT_KEY,
        JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        }),
      );
    } catch {}

    return order;
  }, []);

  return {
    orders,
    now,
    createOrder,
    activeCount: orders.filter((order) => getOrderStage(order, now) < 3).length,
  };
}
