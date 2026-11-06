import { useEffect, useReducer } from "react";
import { dishes } from "../data/menu";

const MAX_QUANTITY = 20;

function initialCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("neko-cart"));

    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(stored).filter(
        ([id, quantity]) =>
          dishes.some((dish) => dish.id === Number(id)) &&
          Number.isInteger(quantity) &&
          quantity > 0 &&
          quantity <= MAX_QUANTITY,
      ),
    );
  } catch {
    return {};
  }
}

function reducer(cart, action) {
  if (action.type === "clear") return {};

  if (!dishes.some((dish) => dish.id === Number(action.id))) {
    return cart;
  }

  const next = { ...cart };

  if (action.type === "remove") {
    delete next[action.id];
  } else if (action.type === "change") {
    const amount = Math.max(
      0,
      Math.min(MAX_QUANTITY, (next[action.id] || 0) + action.delta),
    );

    if (amount) next[action.id] = amount;
    else delete next[action.id];
  }

  return next;
}

export function useCart() {
  const [cart, dispatch] = useReducer(reducer, undefined, initialCart);

  useEffect(() => {
    try {
      localStorage.setItem("neko-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  return {
    cart,
    maxQuantity: MAX_QUANTITY,

    count: Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),

    total: dishes.reduce(
      (sum, dish) => sum + dish.price * (cart[dish.id] || 0),
      0,
    ),

    change: (id, delta) => dispatch({ type: "change", id, delta }),

    remove: (id) => dispatch({ type: "remove", id }),

    clear: () => dispatch({ type: "clear" }),
  };
}
