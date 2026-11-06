import React from "react";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { dishes } from "../data/menu";

const featured = [dishes[0], dishes[1], dishes[2]];

export default function Recommendations({ onNavigate }) {
  return (
    <section
      className="recommendations section"
      id="menu"
      aria-labelledby="recommendations-title"
    >
      <div className="recommendations-heading reveal">
        <div>
          <span className="eyebrow">
            <span className="section-num">01</span>
            ЛЮБИМЧИКИ НЭКО
          </span>

          <h2 id="recommendations-title">
            Наша
            <br />
            <span className="serif">рекомендация.</span>
          </h2>
        </div>

        <div className="recommendations-heading-note">
          <Sparkles size={20} />

          <p>
            Три истории, с которых
            <br />
            стоит начать знакомство.
          </p>
        </div>
      </div>

      <div className="recommendations-grid">
        {featured.map((dish, index) => (
          <article
            className={`recommendation-card recommendation-card-${index + 1} reveal`}
            key={dish.id}
          >
            <div className="recommendation-image">
              <img
                src={`/images/${dish.image}`}
                alt={dish.name}
                loading="lazy"
              />

              <div className="recommendation-image-overlay" />

              <span className="recommendation-number">
                {String(index + 1).padStart(2, "0")}
                <span> / 03</span>
              </span>

              {index === 0 && (
                <span className="recommendation-badge">
                  <Sparkles size={13} />
                  ВЫБОР НЭКО
                </span>
              )}

              <span className="recommendation-image-japanese">
                {["おすすめ", "おいしい", "幸せ"][index]}
              </span>
            </div>

            <div className="recommendation-info">
              <span className="recommendation-category">
                {dish.category}
                <span>✦</span>
                {dish.sub}
              </span>

              <h3>{dish.name}</h3>

              <p>{dish.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="recommendations-footer">
        <div className="recommendations-footer-note">
          <span>✳</span>
          Маленькая Япония начинается со вкуса.
        </div>

        <a
          href="/menu"
          className="recommendations-more"
          onClick={(event) => onNavigate(event, "/menu")}
        >
          <span>
            <small>ЕЩЁ БОЛЬШЕ ВКУСНЫХ ИСТОРИЙ</small>
            Посмотреть всё меню
          </span>

          <span className="recommendations-more-icon">
            <ArrowUpRight size={23} />
          </span>
        </a>
      </div>
    </section>
  );
}
