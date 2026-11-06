import React from "react";
import { ShoppingBag } from "lucide-react";

export default function FloatingCart({ count, onClick }) {
  return (
    <button
      type="button"
      className="floating-cart"
      onClick={onClick}
      aria-label={`Открыть корзину. Товаров: ${count}`}
    >
      <span className="floating-cart-label">МОЙ ЗАКАЗ</span>

      <span className="floating-cart-circle">
        <ShoppingBag
          size={24}
          strokeWidth={1.8}
        />

        <span className="floating-cart-count">{count}</span>
      </span>
    </button>
  );
}
