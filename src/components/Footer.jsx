import React from "react";
import { ArrowUpRight } from "lucide-react";
import Cat from "./Cat";

const predictions = [
  "Твой следующий вечер будет особенно тёплым. Мяу.",
  "Иногда лучший план — ещё одна порция пельменей.",
  "Сегодня ты заслуживаешь маленького приключения.",
];

export default function Footer({ notify }) {
  return (
    <footer className="footer">
      <a
        className="brand"
        href="#"
      >
        <Cat />

        <span>
          NEKO YORU
          <small>У КАЖДОЙ ИСТОРИИ ЕСТЬ СВОЙ ВКУС.</small>
        </span>
      </a>

      <span>Сделано с любовью и щепоткой магии.</span>

      <a href="#">
        Вернуться к началу <ArrowUpRight size={16} />
      </a>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NEKO YORU</span>
        <span>また会いましょう · ДО НОВОЙ ВСТРЕЧИ</span>

        <button
          onClick={() => {
            const index = Math.floor(Math.random() * predictions.length);
            notify(predictions[index]);
          }}
        >
          Маленькое предсказание ✧
        </button>
      </div>
    </footer>
  );
}
