import React, { useEffect, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { dishes, money } from "../data/menu";
import Modal from "./Modal";
import Cat from "./Cat";

const moods = [
  ["cozy", "☾", "Хочется тепла", "Уют, плед и любимая серия"],
  ["adventure", "✳", "Готов к приключениям", "Что-нибудь яркое и с характером"],
  ["dream", "✧", "Мечтательное настроение", "Нежное, лёгкое, особенное"],
];

export default function MenuDialogs({
  dialog,
  onClose,
  cart,
  maxQuantity,
  onAdd,
}) {
  const [mood, setMood] = useState(null);

  useEffect(() => {
    setMood(null);
  }, [dialog]);

  const detail = dialog?.type === "dish" ? dialog.dish : null;

  const recommendation = dishes.find(
    (dish) => dish.id === (mood === "adventure" ? 5 : mood === "dream" ? 2 : 1),
  );

  return (
    <>
      <Modal
        open={Boolean(detail)}
        onClose={onClose}
        title="История блюда"
        className="detail-modal"
      >
        {detail && (
          <>
            <img
              className="detail-photo"
              src={`/images/${detail.image}`}
              alt={detail.name}
            />

            <span className="eyebrow">{detail.sub}</span>
            <h2>{detail.name}</h2>
            <p>{detail.text}</p>

            <div className="tags">
              {detail.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <span>{detail.weight}</span>
            </div>

            <p className="allergen-note">
              Если у тебя есть пищевая аллергия, уточни состав у команды
              ресторана.
            </p>

            <button
              className="button coral full"
              disabled={cart[detail.id] >= maxQuantity}
              onClick={() => onAdd(detail.id)}
            >
              {cart[detail.id]
                ? `В заказе: ${cart[detail.id]} · Добавить ещё`
                : `Добавить в заказ · ${money(detail.price)}`}

              <Plus size={18} />
            </button>
          </>
        )}
      </Modal>

      <Modal
        open={dialog?.type === "mood"}
        onClose={onClose}
        title="Совет Нэко"
        className="mood-modal"
      >
        <Cat className="mood-cat" />

        {!mood ? (
          <>
            <h2>
              Какой сегодня
              <br />
              <span className="serif">твой сюжет?</span>
            </h2>

            <p>Никаких сложных вопросов. Просто выбери ощущение.</p>

            <div className="mood-options">
              {moods.map(([id, icon, title, text]) => (
                <button
                  key={id}
                  onClick={() => setMood(id)}
                >
                  <span>{icon}</span>

                  <div>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </div>

                  <ChevronRight size={19} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="eyebrow">НЭКО ЧУВСТВУЕТ, ЧТО ЭТО ЛЮБОВЬ</span>

            <h2>{recommendation.name}</h2>

            <img
              className="mood-photo"
              src={`/images/${recommendation.image}`}
              alt={recommendation.name}
            />

            <p>{recommendation.text}</p>

            <button
              className="button coral full"
              disabled={cart[recommendation.id] >= maxQuantity}
              onClick={() => {
                onAdd(recommendation.id);
                onClose();
              }}
            >
              Попробовать · {money(recommendation.price)}
              <Plus size={18} />
            </button>

            <button
              className="back-link"
              onClick={() => setMood(null)}
            >
              У меня другое настроение
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
