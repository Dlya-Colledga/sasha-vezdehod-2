import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Minus,
  Plus,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { dishes, money } from "../data/menu";
import { readSavedContact } from "../hooks/useOrders";
import Cat from "./Cat";
import Modal from "./Modal";

function normalizePhone(input) {
  const digits = input.replace(/\D/g, "");

  if (/^996\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+996${digits.slice(1)}`;
  if (/^\d{9}$/.test(digits)) return `+996${digits}`;

  return null;
}

export default function CartModal({ open, onClose, model, onPlace }) {
  const { cart, count, total, change, remove, maxQuantity } = model;

  const [form, setForm] = useState(readSavedContact);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;

    const name = form.name.trim();
    const address = form.address.trim();
    const phone = normalizePhone(form.phone);

    const invalid =
      name.length < 2
        ? {
            field: "name",
            text: "Укажи имя (не менее двух символов).",
          }
        : !phone
          ? {
              field: "phone",
              text: "Введи корректный номер Кыргызстана: +996 555 123 456.",
            }
          : address.length < 8
            ? {
                field: "address",
                text: "Укажи полный адрес доставки: улицу и дом.",
              }
            : null;

    if (invalid) {
      setError(invalid);
      document.getElementById(`delivery-${invalid.field}`)?.focus();
      return;
    }

    setSubmitting(true);

    const success = onPlace({
      name,
      phone,
      address,
      comment: form.comment.trim().slice(0, 300),
    });

    if (!success) {
      setError({
        field: "submit",
        text: "Не удалось оформить заказ. Проверь корзину.",
      });
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Корзина и доставка"
      className="checkout-modal"
    >
      {count === 0 ? (
        <div className="checkout-empty">
          <Cat />

          <h2>Пока только предвкушение.</h2>

          <p>Добавь что-нибудь вкусное и начни новую историю.</p>

          <button
            className="button coral"
            onClick={() => {
              onClose();
              requestAnimationFrame(() =>
                document.getElementById("menu")?.scrollIntoView({
                  behavior: "smooth",
                }),
              );
            }}
          >
            Выбрать блюда <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="checkout-heading">
            <span className="eyebrow">
              ЕЩЁ ЧУТЬ-ЧУТЬ, И ВКУСНАЯ ИСТОРИЯ НАЧНЁТСЯ
            </span>

            <h2>
              Оформим <span className="serif">доставку?</span>
            </h2>
          </div>

          <form
            className="checkout-grid"
            onSubmit={submit}
            noValidate
          >
            <div className="checkout-basket">
              <div className="checkout-panel-title">
                <span>01</span>
                ТВОИ БЛЮДА
                <small>{count} шт.</small>
              </div>

              <div className="checkout-basket-list">
                {dishes
                  .filter((dish) => cart[dish.id])
                  .map((dish) => (
                    <div
                      className="checkout-line"
                      key={dish.id}
                    >
                      <img
                        src={`/images/${dish.image}`}
                        alt=""
                      />

                      <div className="checkout-line-info">
                        <strong>{dish.name}</strong>
                        <small>{money(dish.price)}</small>

                        <div className="checkout-quantity">
                          <button
                            type="button"
                            onClick={() => change(dish.id, -1)}
                            aria-label={`Убрать одну порцию: ${dish.name}`}
                          >
                            <Minus size={13} />
                          </button>

                          <span>{cart[dish.id]}</span>

                          <button
                            type="button"
                            onClick={() => change(dish.id, 1)}
                            disabled={cart[dish.id] >= maxQuantity}
                            aria-label={`Добавить одну порцию: ${dish.name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="checkout-remove"
                        onClick={() => remove(dish.id)}
                        aria-label={`Удалить ${dish.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="checkout-total">
                <span>Итого за блюда</span>
                <strong>{money(total)}</strong>
              </div>

              <p className="checkout-fineprint">
                Стоимость доставки не рассчитывается. Это демонстрационный
                заказ.
              </p>
            </div>

            <div className="checkout-address">
              <div className="checkout-panel-title">
                <span>02</span>
                КУДА ДОСТАВИТЬ?
              </div>

              <div className="checkout-field">
                <label htmlFor="delivery-name">
                  <UserRound size={15} />
                  Твоё имя
                </label>

                <input
                  id="delivery-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Как к тебе обращаться?"
                  aria-invalid={error?.field === "name"}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="delivery-phone">
                  <Phone size={15} />
                  Телефон для связи
                </label>

                <input
                  id="delivery-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={25}
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="+996 555 123 456"
                  aria-invalid={error?.field === "phone"}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="delivery-address">
                  <MapPin size={15} />
                  Адрес доставки
                </label>

                <textarea
                  id="delivery-address"
                  autoComplete="street-address"
                  rows={2}
                  maxLength={250}
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="Город, улица, дом, квартира"
                  aria-invalid={error?.field === "address"}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="delivery-comment">
                  Комментарий
                  <span>(необязательно)</span>
                </label>

                <textarea
                  id="delivery-comment"
                  rows={2}
                  maxLength={300}
                  value={form.comment}
                  onChange={(event) => update("comment", event.target.value)}
                  placeholder="Например, код домофона или ориентир"
                />
              </div>

              {error && (
                <p
                  className="checkout-error"
                  role="alert"
                >
                  {error.text}
                </p>
              )}

              <button
                className="checkout-submit"
                type="submit"
                disabled={submitting || !count}
              >
                Оформить заказ <ArrowRight size={19} />
              </button>

              <p className="checkout-privacy">
                Данные и заказы сохраняются только в этом браузере. Реального
                заказа или оплаты не происходит.
              </p>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
