import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  VolumeX,
  Music2,
} from "lucide-react";
import { useAtmosphere } from "../hooks/useAtmosphere";

export default function Hero() {
  const [music, toggleMusic] = useAtmosphere();

  return (
    <>
      <section
        className="hero"
        aria-labelledby="hero-title"
      >
        <div className="hero-art" />
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="hero-kicker">
            <span /> ТВОЯ МАЛЕНЬКАЯ ЯПОНИЯ В БИШКЕКЕ
          </div>

          <h1 id="hero-title">
            У каждой
            <br />
            истории есть
            <br />
            <em>свой вкус.</em>
            <svg
              viewBox="0 0 350 18"
              aria-hidden="true"
            >
              <path d="M2 12Q170-4 345 8M30 17Q180 3 330 14" />
            </svg>
          </h1>

          <p>
            Загляни в мир, где рамэн согревает душу,
            <br className="desktop-break" /> а ты всегда главный герой.
          </p>

          <div className="hero-actions">
            <a
              href="#menu"
              className="button coral"
            >
              Открыть меню <ArrowUpRight size={20} />
            </a>

            <a
              href="#visit"
              className="hero-link"
            >
              Как нас найти <ArrowRight size={18} />
            </a>
          </div>

          <div className="hero-note">
            <span className="tiny-stars">✧</span>
            Здесь можно быть собой. И немного персонажем.
          </div>
        </div>

        <div
          className="vertical-japanese"
          aria-hidden="true"
        >
          お か え り な さ い
        </div>

        <div className="hero-stamp">
          <span>おいしい</span>
          <strong>
            Вкусно,
            <br />
            как в аниме
          </strong>
          <span>✦ NEKO APPROVED ✦</span>
        </div>

        <div className="hero-bottom">
          <a href="#menu">
            <span className="scroll-circle">
              <ArrowDown size={15} />
            </span>
            ЛИСТАЙ СВОЮ ИСТОРИЮ
          </a>

          <button
            className={`sound-button ${music ? "playing" : ""}`}
            onClick={toggleMusic}
            aria-pressed={music}
          >
            <span className="sound-bars">
              <i />
              <i />
              <i />
              <i />
            </span>

            <span>
              {music ? "Вечер звучит" : "Добавить атмосферы"}
              <small>NEKO RADIO · LO-FI VIBES</small>
            </span>

            {music ? <VolumeX size={17} /> : <Music2 size={17} />}
          </button>
        </div>

        <span className="hero-chapter">第 一 章 / ГЛАВА 01</span>
      </section>

      <div
        className="ticker"
        aria-hidden="true"
      >
        <div>
          {Array.from({ length: 3 }, (_, index) => (
            <React.Fragment key={index}>
              <span>ХОРОШАЯ ЕДА</span>
              <b>✳</b>
              <span>БОЛЬШИЕ ЧУВСТВА</span>
              <b>✳</b>
              <span>МАЛЕНЬКАЯ ЯПОНИЯ</span>
              <b>✳</b>
              <span className="japanese">いただきます</span>
              <b>✳</b>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
