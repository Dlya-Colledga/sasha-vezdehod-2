import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Gift,
  Sparkles,
  Clock3,
  BookOpen,
} from "lucide-react";
import { events, getEventStatus, getFeaturedEvents } from "../data/events";

const statusLabels = {
  upcoming: "СКОРО",
  live: "ПРОХОДИТ СЕЙЧАС",
  past: "ЗАВЕРШЕНО",
};

function EventCard({ event, compact = false, onNavigate, now }) {
  const status = getEventStatus(event, now);
  const destination = compact ? `/events#event-${event.id}` : "/menu";

  return (
    <article
      id={compact ? undefined : `event-${event.id}`}
      className={`ny-event-card ny-event-${event.theme} ${
        compact ? "ny-event-compact" : "ny-event-expanded"
      }`}
    >
      <div className="ny-event-poster">
        <img
          className="ny-event-cover"
          src={event.cover}
          alt={`Обложка события: ${event.title}`}
          loading="lazy"
        />

        <div className="ny-event-cover-overlay" />

        <span className="ny-event-cover-label">NEKO YORU · SPECIAL EVENT</span>

        <div className="ny-event-cover-anniversary">
          <strong>{event.number}</strong>
          <span>ЛЕТ</span>
        </div>

        <span className="ny-event-cover-date">{event.date} · 2026</span>
      </div>

      <div className="ny-event-body">
        <div className="ny-event-meta">
          <span className="ny-event-date">
            <CalendarDays size={14} />
            {event.date} 2026
          </span>

          <span className={`ny-event-status status-${status}`}>
            <i />
            {statusLabels[status]}
          </span>
        </div>

        <span className="ny-event-category">{event.category}</span>

        <h3>{event.title}</h3>

        <p className="ny-event-subtitle">{event.subtitle}</p>

        <p className="ny-event-description">{event.description}</p>

        <div className="ny-event-offer">
          <Gift
            size={20}
            strokeWidth={1.6}
          />
          <div>
            <span>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</span>
            <strong>{event.offer}</strong>
          </div>
        </div>

        {!compact && (
          <div className="ny-event-extra">
            <span className="ny-event-extra-title">
              <Sparkles size={15} />
              ЧТО ТЕБЯ ЖДЁТ
            </span>

            <p>{event.details}</p>

            <div className="ny-event-premiere">
              <BookOpen size={14} />
              Оригинальная премьера: {event.originalDate}
            </div>
          </div>
        )}

        <div className="ny-event-actions">
          <a
            href={destination}
            className="ny-event-action"
            onClick={(e) => onNavigate(e, destination)}
          >
            {compact ? "Подробнее" : "Посмотреть меню"}
            <ArrowUpRight size={18} />
          </a>

          {!compact && (
            <a
              href={event.source}
              target="_blank"
              rel="noopener noreferrer"
              className="ny-event-source"
            >
              Источник даты
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventsPreview({ onNavigate }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const featured = getFeaturedEvents(now);

  return (
    <section
      className="ny-events-preview section"
      id="evenings"
      aria-labelledby="ny-events-preview-title"
    >
      <div className="ny-events-intro reveal">
        <div>
          <span className="eyebrow">
            <span className="section-num">03</span>
            КАЛЕНДАРЬ NEKO YORU
          </span>

          <h2 id="ny-events-preview-title">
            Поводы <span className="serif">встретиться.</span>
          </h2>
        </div>

        <p>
          У любимых историй бывают годовщины.
          <br />А у нас — идеи, как их отпраздновать.
        </p>
      </div>

      <div className="ny-events-preview-grid">
        {featured.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            compact
            onNavigate={onNavigate}
            now={now}
          />
        ))}
      </div>

      <div className="ny-events-preview-footer">
        <p>
          Юбилеи реальны. Акции и даты мероприятий — демонстрационные
          предложения.
        </p>

        <a
          href="/events"
          className="ny-events-all-link"
          onClick={(e) => onNavigate(e, "/events")}
        >
          Смотреть все события
          <span>
            <ArrowRight size={20} />
          </span>
        </a>
      </div>
    </section>
  );
}

export function EventsPage({ onNavigate }) {
  const [now, setNow] = useState(Date.now);
  const [filter, setFilter] = useState(() =>
    window.location.hash.startsWith("#event-") ? "all" : "current",
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const current = events.filter(
    (event) => getEventStatus(event, now) !== "past",
  );

  const past = events.filter((event) => getEventStatus(event, now) === "past");

  const visible =
    filter === "current" ? current : filter === "past" ? past : events;

  return (
    <div className="ny-events-page">
      <section className="ny-events-hero">
        <div className="ny-events-hero-inner">
          <a
            href="/"
            className="ny-events-back"
            onClick={(e) => onNavigate(e, "/")}
          >
            <ArrowLeft size={15} />
            НА ГЛАВНУЮ
          </a>

          <span className="ny-events-hero-kicker">
            <Sparkles size={15} />
            NEKO YORU / EVENT ARCHIVE
          </span>

          <h1>
            Истории, ради
            <br />
            которых <em>встречаются.</em>
          </h1>

          <p>
            Годовщины культовых аниме, тематические вечера и маленькие поводы
            провести время вместе.
          </p>

          <div className="ny-events-hero-stats">
            <div>
              <strong>{events.length.toString().padStart(2, "0")}</strong>
              <span>СОБЫТИЯ</span>
            </div>

            <div>
              <strong>{current.length.toString().padStart(2, "0")}</strong>
              <span>ВПЕРЕДИ</span>
            </div>

            <div>
              <Clock3 size={20} />
              <span>NEKO YORU · 2026</span>
            </div>
          </div>
        </div>

        <span
          className="ny-events-hero-jp"
          aria-hidden="true"
        >
          物語の夜
        </span>
        <span
          className="ny-events-hero-decoration"
          aria-hidden="true"
        >
          ✳
        </span>
      </section>

      <section className="ny-events-list-section">
        <div className="ny-events-list-heading">
          <div>
            <span className="eyebrow">ТВОЙ КАЛЕНДАРЬ ВЕЧЕРОВ</span>

            <h2>
              Что <span className="serif">в программе?</span>
            </h2>
          </div>

          <p>
            Выбери историю, которая тебе близка. Узнай о поводе и предложении.
          </p>
        </div>

        <div
          className="ny-events-filters"
          role="group"
          aria-label="Фильтр мероприятий"
        >
          {[
            ["current", "Актуальные", current.length],
            ["past", "Прошедшие", past.length],
            ["all", "Все события", events.length],
          ].map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "active" : ""}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
              <sup>{count}</sup>
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="ny-events-full-grid">
            {visible.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onNavigate={onNavigate}
                now={now}
              />
            ))}
          </div>
        ) : (
          <div className="ny-events-empty">
            <span>✧</span>
            <h3>Пока новых встреч не запланировано.</h3>
            <p>Прошлые события можно посмотреть в архиве.</p>

            <button onClick={() => setFilter("past")}>
              Открыть архив <ArrowRight size={17} />
            </button>
          </div>
        )}

        <p className="ny-events-disclaimer">
          Это концепция календаря NEKO YORU. Исторические даты премьер
          подтверждены источниками, а даты локальных мероприятий и скидки
          являются демонстрационными. Предложения пока не применяются к корзине
          и не являются официальными акциями. Публичных кинопоказов не
          предусмотрено.
        </p>
      </section>

      <section className="ny-events-ending">
        <div>
          <span className="eyebrow">МЕЖДУ СОБЫТИЯМИ ТОЖЕ ЕСТЬ МАГИЯ</span>
          <h2>
            Продолжение <span className="serif">за столом.</span>
          </h2>
          <p>Любимая еда — уже хороший повод встретиться.</p>
        </div>

        <a
          href="/menu"
          className="button coral"
          onClick={(e) => onNavigate(e, "/menu")}
        >
          Посмотреть меню <ArrowUpRight size={18} />
        </a>
      </section>
    </div>
  );
}
