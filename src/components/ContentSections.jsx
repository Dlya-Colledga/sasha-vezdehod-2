import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import Cat from "./Cat";
import VisitMap, { GIS_URL } from "./VisitMap";

export default function ContentSections({ onMoodOpen }) {
  return (
    <>
      <section
        className="story-section section"
        id="story"
      >
        <div className="story-visual reveal">
          <img
            src="/images/neko-night.png"
            alt="Тёплый свет маленькой японской рамэнной в ночном переулке"
            loading="lazy"
          />

          <div className="photo-caption">
            <span>いつもの場所</span> Место, куда хочется вернуться.
          </div>

          <div className="story-label">
            НЕ ПРОСТО РЕСТОРАН.
            <br />
            <b>ТВОЯ ТОЧКА СОХРАНЕНИЯ.</b>
          </div>
        </div>

        <div className="story-copy reveal">
          <span className="eyebrow">
            <span className="section-num">02</span>
            ПО ТУ СТОРОНУ ЭКРАНА
          </span>

          <h2>
            Некоторые места
            <br />
            похожи на <span className="serif">объятия.</span>
          </h2>

          <p>
            Помнишь тот самый момент в аниме, когда герой заходит в маленькую
            рамэнную, а весь шум большого мира остаётся за дверью?
          </p>

          <p>
            Мы придумали NEKO YORU именно таким. Тёплый свет, любимые истории на
            полке и еда, ради которой можно поставить серию на паузу.
          </p>

          <div className="story-details">
            <span>
              <span>一</span> Рамэн, сваренный с терпением
            </span>
            <span>
              <span>二</span> Манга, которую можно полистать
            </span>
            <span>
              <span>三</span> Место для твоей компании
            </span>
          </div>

          <a
            className="text-link"
            href="#visit"
          >
            Побудь у нас немного <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <section className="neko-note section reveal">
        <div className="neko-illustration">
          <Cat />
          <span>にゃー</span>
        </div>

        <div>
          <span className="eyebrow">МЯУ. Я НЭКО, ХРАНИТЕЛЬ ЭТОГО МЕСТА.</span>

          <h3>
            Не знаешь, чего хочется?
            <br />
            <span className="serif">Начни с настроения.</span>
          </h3>

          <p>Найду блюдо для твоего сегодняшнего сюжета.</p>
        </div>

        <button
          className="button dark"
          onClick={onMoodOpen}
        >
          Доверься Нэко <Sparkles size={18} />
        </button>

        <span
          className="note-spark"
          aria-hidden="true"
        >
          ✳
        </span>
      </section>

      <section
        className="events-section section"
        id="evenings"
      >
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">
              <span className="section-num">03</span>
              ПРОДОЛЖЕНИЕ СЛЕДУЕТ
            </span>

            <h2>
              Заходи <span className="serif">на огонёк.</span>
            </h2>
          </div>

          <p className="muted">
            Хорошие вечера случаются,
            <br />
            когда мы собираемся вместе.
          </p>
        </div>

        <div className="events-grid">
          <a
            className="event-card event-orange reveal"
            href="#visit"
          >
            <div className="event-top">
              <span>КАЖДУЮ ПЯТНИЦУ · 19:00</span>
              <ArrowUpRight />
            </div>

            <div
              className="event-art moon-art"
              aria-hidden="true"
            >
              <span className="moon" />
              <span className="orbit one" />
              <span className="orbit two" />
              <span className="spark s1">✧</span>
              <span className="spark s2">✦</span>
              <span className="event-jp">映画の夜</span>
            </div>

            <div className="event-bottom">
              <span className="eyebrow">ЕЩЁ ОДНА СЕРИЯ?</span>

              <h3>
                Аниме, рамэн
                <br />и никаких спойлеров.
              </h3>

              <span className="event-link">
                Как нас найти <ArrowRight size={18} />
              </span>
            </div>
          </a>

          <a
            className="event-card event-green reveal"
            href="#visit"
          >
            <div className="event-top">
              <span>КАЖДУЮ СУББОТУ · 18:00</span>
              <ArrowUpRight />
            </div>

            <div
              className="event-art game-art"
              aria-hidden="true"
            >
              <span className="game-tile tile1">
                龍<small>DRAGON</small>
              </span>

              <span className="game-tile tile2">
                猫<small>NEKO</small>
              </span>

              <span className="spark s2">✳</span>
            </div>

            <div className="event-bottom">
              <span className="eyebrow">СОБЕРИ СВОЮ КОМАНДУ</span>

              <h3>
                Новые друзья.
                <br />
                Новая партия.
              </h3>

              <span className="event-link">
                Как нас найти <ArrowRight size={18} />
              </span>
            </div>
          </a>
        </div>
      </section>

      <section
        className="visit section reveal"
        id="visit"
      >
        <div className="visit-copy">
          <span className="eyebrow">ТВОЯ СЛЕДУЮЩАЯ ОСТАНОВКА</span>

          <h2>
            Увидимся
            <br />
            <span className="serif">под луной.</span>
            <span className="visit-star">✦</span>
          </h2>

          <p className="visit-description">
            Где город становится тише,
            <br />
            а каждая встреча превращается
            <br />в маленькую историю.
          </p>

          <div className="visit-meta">
            <p>
              <MapPin size={17} />
              Бишкек, Кыргызстан
            </p>

            <p>
              <Clock size={17} />
              Точный адрес и часы работы — в 2ГИС
            </p>
          </div>

          <a
            className="button coral"
            href={GIS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Проложить маршрут
            <ArrowUpRight size={19} />
          </a>

          <div className="visit-small-note">
            <span>✧</span>
            МАЛЕНЬКАЯ ЯПОНИЯ ЖДЁТ ТЕБЯ
          </div>
        </div>

        <VisitMap />
      </section>
    </>
  );
}
