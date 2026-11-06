import { useEffect, useReducer } from "react";
import { dishes } from "../data/menu";

const MAX_QUANTITY = 20;

const findDish = (id) => dishes.find((dish) => dish.id === Number(id));

const validQuantity = (value) =>
  Number.isInteger(value) && value > 0 && value <= MAX_QUANTITY;

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function initialState() {
  const stored = read("neko-cart", {});

  const cart =
    stored && typeof stored === "object" && !Array.isArray(stored)
      ? Object.fromEntries(
          Object.entries(stored).filter(
            ([id, quantity]) => findDish(id) && validQuantity(quantity),
          ),
        )
      : {};

  const saved = read("neko-order", null);

  const validOrder =
    saved &&
    typeof saved.id === "string" &&
    Array.isArray(saved.items) &&
    saved.items.length > 0 &&
    Number.isFinite(saved.total) &&
    saved.items.every(
      (item) =>
        item &&
        findDish(item.id) &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        validQuantity(item.quantity),
    ) &&
    saved.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ===
      saved.total;

  return {
    cart,
    order: validOrder && !Object.keys(cart).length ? saved : null,
  };
}

function reducer(state, action) {
  if (action.type === "checkout") {
    const items = dishes
      .filter((dish) => state.cart[dish.id])
      .map((dish) => ({
        ...dish,
        quantity: state.cart[dish.id],
      }));

    if (!items.length) return state;

    return {
      cart: {},
      order: {
        id: action.id,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    };
  }

  if (!findDish(action.id)) return state;

  const cart = { ...state.cart };

  if (action.type === "change") {
    cart[action.id] = Math.max(
      0,
      Math.min(MAX_QUANTITY, (cart[action.id] || 0) + action.delta),
    );

    if (!cart[action.id]) delete cart[action.id];
  } else if (action.type === "remove") {
    delete cart[action.id];
  } else {
    return state;
  }

  return { cart, order: null };
}

export function useCart() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    try {
      localStorage.setItem("neko-cart", JSON.stringify(state.cart));

      if (state.order) {
        localStorage.setItem("neko-order", JSON.stringify(state.order));
      } else {
        localStorage.removeItem("neko-order");
      }
    } catch {}
  }, [state]);

  return {
    ...state,

    maxQuantity: MAX_QUANTITY,

    count: Object.values(state.cart).reduce(
      (sum, quantity) => sum + quantity,
      0,
    ),

    total: dishes.reduce(
      (sum, dish) => sum + dish.price * (state.cart[dish.id] || 0),
      0,
    ),

    change: (id, delta) => dispatch({ type: "change", id, delta }),

    remove: (id) => dispatch({ type: "remove", id }),

    checkout: () =>
      dispatch({
        type: "checkout",
        id: String(Date.now()).slice(-8),
      }),
  };
}
