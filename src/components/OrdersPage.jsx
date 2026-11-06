import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  CalendarDays,
  ChefHat,
  Check,
  ClipboardCheck,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
} from "lucide-react";

import Cat from "./Cat";
import { money } from "../data/menu";
import {
  getOrderStage,
  ORDER_STAGES,
  secondsToNextStage,
} from "../hooks/useOrders";

const icons = [ClipboardCheck, ChefHat, Bike, PackageCheck];

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default function OrdersPage({ orders, now, onNavigate }) {
  const active = orders.filter((order) => getOrderStage(order, now) < 3);

  const history = orders.filter((order) => getOrderStage(order, now) === 3);

  const [tab, setTab] = useState(() => (active.length ? "active" : "history"));

  const [selectedId, setSelectedId] = useState(
    () => (active[0] || history[0])?.id || null,
  );

  useEffect(() => {
    if (
      tab === "active" &&
      selectedId &&
      history.some((order) => order.id === selectedId)
    ) {
      setTab("history");
    }
  }, [tab, selectedId, history.length]);

  const visible = tab === "active" ? active : history;

  const selected =
    visible.find((order) => order.id === selectedId) || visible[0];

  const stage = selected ? getOrderStage(selected, now) : 0;

  const CurrentIcon = icons[stage];

  return (
    <div className="orders-page">
      <section className="orders-hero">
        <div className="orders-hero-inner">
          <span className="orders-eyebrow">NEKO YORU · 配達の物語</span>

          <h1>
            Твои вкусные <em>истории.</em>
          </h1>

          <p>От первой искры на кухне до последней вкусной минуты.</p>

          <span
            className="orders-hero-deco"
            aria-hidden="true"
          >
            ✳
          </span>
        </div>
      </section>

      <section
        className="orders-workspace"
        aria-label="Мои заказы"
      >
        <div className="orders-sidebar">
          <div className="orders-sidebar-heading">
            <span className="eyebrow">ТВОЯ ЛИЧНАЯ ХРОНИКА</span>

            <h2>
              Мои заказы
              <span className="orders-total">{orders.length}</span>
            </h2>
          </div>

          <div
            className="orders-tabs"
            role="group"
            aria-label="Фильтр заказов"
          >
            <button
              className={tab === "active" ? "active" : ""}
              aria-pressed={tab === "active"}
              onClick={() => {
                setTab("active");
                setSelectedId(active[0]?.id || null);
              }}
            >
              Активные <span>{active.length}</span>
            </button>

            <button
              className={tab === "history" ? "active" : ""}
              aria-pressed={tab === "history"}
              onClick={() => {
                setTab("history");
                setSelectedId(history[0]?.id || null);
              }}
            >
              История <span>{history.length}</span>
            </button>
          </div>

          {visible.length ? (
            <div className="orders-list">
              {visible.map((order) => {
                const step = getOrderStage(order, now);

                return (
                  <button
                    key={order.id}
                    type="button"
                    className={`orders-list-item ${
                      selected?.id === order.id ? "selected" : ""
                    }`}
                    aria-pressed={selected?.id === order.id}
                    onClick={() => setSelectedId(order.id)}
                  >
                    <span className="orders-list-top">
                      <strong>№ {order.id}</strong>
                      <ArrowUpRight size={16} />
                    </span>

                    <span className="orders-list-date">
                      {dateFormat.format(order.createdAt)}
                    </span>

                    <span className="orders-list-bottom">
                      <span
                        className={`orders-chip ${step === 3 ? "done" : ""}`}
                      >
                        <span />
                        {step === 3 ? "Доставлено" : "Активен"}
                      </span>

                      <b>{money(order.total)}</b>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="orders-sidebar-empty">
              {tab === "active"
                ? "Сейчас нет активных заказов."
                : "История пока пустая."}
            </div>
          )}

          <a
            className="orders-another-link"
            href="/menu"
            onClick={(event) => onNavigate(event, "/menu")}
          >
            Вернуться к меню
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="orders-main-panel">
          {selected ? (
            <>
              <div className="orders-status-top">
                <span className="orders-status-label">
                  ИСТОРИЯ ЗАКАЗА · {selected.id}
                </span>

                <span className="orders-status-number">
                  第 {String(stage + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="orders-status-scene">
                <div
                  className="orders-status-illustration"
                  key={stage}
                >
                  <span className="orders-status-ring" />
                  <CurrentIcon
                    size={52}
                    strokeWidth={1.35}
                  />
                  <span className="orders-status-spark">✧</span>
                </div>

                <span className="orders-stage-eyebrow">
                  ЭТАП {stage + 1} / 4
                </span>

                <h2 aria-live="polite">{ORDER_STAGES[stage].title}</h2>

                <p>{ORDER_STAGES[stage].description}</p>

                {stage < 3 && (
                  <span className="orders-next-update">
                    Следующий этап через {secondsToNextStage(selected, now)}{" "}
                    сек.
                  </span>
                )}
              </div>

              <div
                className="orders-timeline"
                aria-label="Этапы доставки"
              >
                {ORDER_STAGES.map((item, index) => (
                  <div
                    key={item.title}
                    className={`orders-timeline-item ${
                      index <= stage ? "reached" : ""
                    } ${index === stage ? "current" : ""}`}
                  >
                    <span className="orders-timeline-dot">
                      {index < stage ? <Check size={13} /> : index + 1}
                    </span>

                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="orders-detail-grid">
                <div className="orders-detail-block">
                  <span className="orders-block-kicker">
                    <ShoppingBag size={15} />
                    СОСТАВ ЗАКАЗА
                  </span>

                  {selected.items.map((item) => (
                    <div
                      className="orders-item-row"
                      key={item.id}
                    >
                      <img
                        src={`/images/${item.image}`}
                        alt=""
                      />

                      <div>
                        <b>{item.name}</b>
                        <small>{item.quantity} порц.</small>
                      </div>

                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}

                  <div className="orders-detail-total">
                    <span>Итого за блюда</span>
                    <strong>{money(selected.total)}</strong>
                  </div>
                </div>

                <div className="orders-detail-block orders-delivery-info">
                  <span className="orders-block-kicker">
                    <MapPin size={15} />
                    ДОСТАВКА
                  </span>

                  <b>{selected.customer.name}</b>
                  <p>{selected.customer.address}</p>

                  <a href={`tel:${selected.customer.phone}`}>
                    <Phone size={14} />
                    {selected.customer.phone}
                  </a>

                  {selected.customer.comment && (
                    <p className="orders-comment">
                      «{selected.customer.comment}»
                    </p>
                  )}

                  <div className="orders-created">
                    <CalendarDays size={14} />
                    {dateFormat.format(selected.createdAt)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="orders-empty-state">
              <Cat />

              <span className="eyebrow">ПОКА ТИХО, НО ЭТО НЕНАДОЛГО</span>

              <h2>
                {tab === "active"
                  ? "Ни одной истории в пути."
                  : "Здесь появятся завершённые заказы."}
              </h2>

              <p>
                Выбери то, что хочется сегодня, и начни новую вкусную главу.
              </p>

              <a
                href="/menu"
                className="button coral"
                onClick={(event) => onNavigate(event, "/menu")}
              >
                Выбрать блюда
                <ArrowUpRight size={18} />
              </a>

              {tab === "active" && history.length > 0 && (
                <button
                  className="orders-history-button"
                  onClick={() => {
                    setTab("history");
                    setSelectedId(history[0]?.id || null);
                  }}
                >
                  Посмотреть историю
                </button>
              )}
            </div>
          )}

          <p className="orders-demo-notice">
            Это демонстрация. Статусы сменяются автоматически; заказы не
            отправляются ресторану.
          </p>
        </div>
      </section>
    </div>
  );
}
