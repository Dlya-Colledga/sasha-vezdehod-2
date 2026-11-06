import React from "react";
import { ArrowRight, Check, Plus, Minus, X } from "lucide-react";
import { dishes, money } from "../data/menu";
import Cat from "./Cat";
import Modal from "./Modal";

export default function CartModal({ open, onClose, model }) {
  const { cart, order, count, total, change, remove, checkout, maxQuantity } =
    model;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Твой заказ"
      className="cart-modal"
    >
      {order ? (
        <div className="success">
          <span className="success-icon">
            <Check />
          </span>
          <span className="eyebrow">ТВОЯ ВКУСНАЯ ИСТОРИЯ</span>

          <h2>Всё собрано!</h2>

          <p>
            Заказ № {order.id} сохранён.
            <br />
            Покажи его команде, когда будешь у нас.
          </p>

          <div className="receipt">
            {order.items.map((dish) => (
              <p key={dish.id}>
                <span>
                  {dish.name} × {dish.quantity}
                </span>
                <b>{money(dish.price * dish.quantity)}</b>
              </p>
            ))}

            <p>
              <strong>Итого</strong>
              <strong>{money(order.total)}</strong>
            </p>
          </div>

          <button
            className="button dark full"
            onClick={onClose}
          >
            До встречи под луной <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <h2>
            Твоя вкусная
            <br />
            <span className="serif">история.</span>
          </h2>

          {count === 0 ? (
            <div className="empty-cart">
              <Cat />

              <p>
                Пока здесь только предвкушение.
                <br />
                Давай добавим что-нибудь вкусное?
              </p>

              <button
                className="button coral"
                onClick={() => {
                  onClose();
                  document.getElementById("menu")?.scrollIntoView();
                }}
              >
                Выбрать блюдо <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {dishes
                  .filter((dish) => cart[dish.id])
                  .map((dish) => (
                    <div
                      className="cart-line"
                      key={dish.id}
                    >
                      <img
                        src={`/images/${dish.image}`}
                        alt=""
                      />

                      <div>
                        <strong>{dish.name}</strong>
                        <small>{money(dish.price)}</small>

                        <div className="quantity">
                          <button
                            onClick={() => change(dish.id, -1)}
                            aria-label={`Убрать одну порцию ${dish.name}`}
                          >
                            <Minus size={14} />
                          </button>

                          <span>{cart[dish.id]}</span>

                          <button
                            onClick={() => change(dish.id, 1)}
                            disabled={cart[dish.id] >= maxQuantity}
                            aria-label={`Добавить одну порцию ${dish.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove"
                        aria-label={`Удалить ${dish.name}`}
                        onClick={() => remove(dish.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="cart-total">
                <span>Итого</span>
                <strong>{money(total)}</strong>
              </div>

              <p className="checkout-note">
                Собери заказ заранее и покажи его при посещении.
                <br />
                Оплата — в ресторане.
              </p>

              <button
                className="button coral full"
                onClick={checkout}
              >
                Сохранить мой заказ <ArrowRight size={18} />
              </button>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
