import React, { useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  UtensilsCrossed,
  Heart,
  Check,
  Plus,
  Leaf,
} from "lucide-react";
import { dishes, categories, money } from "../data/menu";

export default function MenuSection({
  cart,
  maxQuantity,
  onAdd,
  onDetailOpen,
  onMoodOpen,
  onOpenMenu,
  fullMenu = false,
}) {
  const [category, setCategory] = useState("Всё меню");

  const visibleDishes = dishes.filter((dish) =>
    category === "Всё меню"
      ? fullMenu || dish.id <= 4
      : dish.category === category,
  );

  return (
    <section
      className={`menu-section section ${fullMenu ? "menu-page-list" : ""}`}
      id="menu"
    >
      <div className="section-heading reveal">
        <div>
          <span className="eyebrow">
            <span className="section-num">{fullMenu ? "02" : "01"}</span>
            МЕНЮ С ХАРАКТЕРОМ
          </span>

          <h2>
            {fullMenu ? "Выбери своего" : "Выбери свою"}
            <br />
            <span className="serif">
              {fullMenu ? "вкусного героя." : "вкусную арку."}
            </span>
          </h2>
        </div>

        <div className="menu-intro">
          <p>
            От первого глотка бульона до последней
            <br />
            рисинки. Здесь у каждого блюда своя история.
          </p>

          <button
            className="text-link"
            onClick={onMoodOpen}
          >
            <Sparkles size={17} />
            Что мне попробовать?
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="menu-toolbar">
        <div
          className="tabs"
          role="group"
          aria-label="Категории меню"
        >
          {categories.map((item, index) => (
            <button
              key={item}
              aria-pressed={category === item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {index === 0 && <UtensilsCrossed size={15} />}

              {item}

              <sup>
                {item === "Всё меню"
                  ? dishes.length
                  : dishes.filter((dish) => dish.category === item).length}
              </sup>
            </button>
          ))}
        </div>

        <span className="menu-small">
          СДЕЛАНО С ДУШОЙ <Heart size={13} />
        </span>
      </div>

      <div
        className="dish-grid"
        aria-live="polite"
      >
        {visibleDishes.map((dish, index) => (
          <article
            className="dish-card"
            key={dish.id}
            style={{
              animationDelay: `${index * 70}ms`,
            }}
          >
            <button
              className="dish-image"
              onClick={() => onDetailOpen(dish)}
              aria-label={`Подробнее: ${dish.name}`}
            >
              <img
                src={`/images/${dish.image}`}
                alt={dish.name}
                loading="lazy"
              />

              {dish.badge && (
                <span
                  className={`dish-badge ${dish.id === 1 ? "signature" : ""}`}
                >
                  {dish.id === 1 && <Sparkles size={12} />}
                  {dish.badge}
                </span>
              )}

              <span className="image-arrow">
                <ArrowUpRight size={20} />
              </span>

              <span className="dish-number">
                EP. {String(dish.id).padStart(2, "0")}
              </span>
            </button>

            <div className="dish-info">
              <span className="dish-sub">{dish.sub}</span>

              <button
                className="dish-title"
                onClick={() => onDetailOpen(dish)}
              >
                {dish.name}
              </button>

              <div className="dish-bottom">
                <span>
                  <strong>{money(dish.price)}</strong>
                  <small>{dish.weight}</small>
                </span>

                <button
                  className={`add-button ${cart[dish.id] ? "added" : ""}`}
                  disabled={cart[dish.id] >= maxQuantity}
                  onClick={() => onAdd(dish.id)}
                  aria-label={`Добавить ${dish.name}`}
                >
                  {cart[dish.id] ? (
                    <>
                      <Check size={15} />
                      <span>{cart[dish.id]}</span>
                    </>
                  ) : (
                    <Plus size={21} />
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="menu-foot">
        <span>
          <Leaf size={15} />
          Есть блюда без мяса. О составе расскажем с удовольствием.
        </span>

        {fullMenu ? (
          <span className="menu-page-footnote">
            いただきます · ПРИЯТНОГО АППЕТИТА
          </span>
        ) : (
          <a
            href="/menu"
            className="text-link"
            onClick={onOpenMenu}
          >
            Смотреть полное меню
            <ArrowRight size={17} />
          </a>
        )}
      </div>
    </section>
  );
}
