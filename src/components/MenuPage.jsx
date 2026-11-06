import React from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { dishes } from "../data/menu";

export default function MenuPage({ onNavigate }) {
  return (
    <section
      className="menu-cover"
      aria-labelledby="menu-cover-title"
    >
      <div
        className="menu-cover-image"
        aria-hidden="true"
      />
      <div
        className="menu-cover-glow"
        aria-hidden="true"
      />

      <div className="menu-cover-inner">
        <div className="menu-cover-copy">
          <div className="menu-breadcrumb">
            <a
              href="/"
              onClick={(event) => onNavigate(event, "/")}
            >
              ГЛАВНАЯ
            </a>
            <ArrowRight
              size={13}
              aria-hidden="true"
            />
            <span>МЕНЮ</span>
          </div>

          <div className="menu-cover-kicker">
            <Sparkles size={14} />
            NEKO YORU · VOL. 02
          </div>

          <h1 id="menu-cover-title">
            Вкусная
            <span>история</span>
            <em>начинается здесь.</em>
          </h1>

          <p>
            Шесть маленьких приключений, созданных с душой. Открой своё, добавь
            в заказ и позволь вечеру стать особенным.
          </p>

          <a
            href="#menu"
            className="menu-explore-button"
          >
            Исследовать меню
            <ArrowUpRight size={19} />
          </a>

          <div className="menu-cover-index">
            <span
              className="menu-index-line"
              aria-hidden="true"
            />
            <span>
              第 二 章 <i>·</i> ГЛАВА ВТОРАЯ
            </span>
          </div>
        </div>

        <div
          className="menu-cover-gallery"
          aria-hidden="true"
        >
          <span className="menu-gallery-moon" />
          <span className="menu-gallery-japanese">おいしいものがたり</span>

          <div className="menu-photo menu-photo-primary">
            <img
              src={`/images/${dishes[0].image}`}
              alt=""
              fetchPriority="high"
            />

            <div className="menu-photo-label">
              <span>01 / ГЛАВНЫЙ ГЕРОЙ</span>
              <b>ラーメン</b>
            </div>
          </div>

          <div className="menu-photo menu-photo-secondary">
            <img
              src={`/images/${dishes[3].image}`}
              alt=""
            />

            <div className="menu-photo-label">
              <span>04 / ТИХИЙ ЛЕС</span>
              <b>抹茶</b>
            </div>
          </div>

          <span className="menu-gallery-star">✳</span>
          <span className="menu-gallery-script">made with love</span>
        </div>
      </div>

      <div className="menu-cover-bottom">
        <span>
          NEKO YORU <i>✧</i> ВСЁ ВКУСНОЕ СОБРАНО ЗДЕСЬ
        </span>

        <a href="#menu">
          ЛИСТАЙ НИЖЕ
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
