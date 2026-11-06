export const events = [
  {
    id: "fireflies",
    theme: "fireflies",
    kanji: "蛍",
    number: "38",
    title: "38 лет «Могиле светлячков»",
    subtitle: "Вечер тихих историй",
    category: "КИНО · ГОДОВЩИНА",
    start: "2026-11-13",
    end: "2026-11-15",
    date: "13–15 ноября",
    offer: "−15% на рамэн",
    description:
      "История, которая остаётся с нами на десятилетия. В год 38-летия фильма вспоминаем силу японской анимации и проводим уютные вечера за согревающим рамэном.",
    details:
      "Камерный тематический вечер: разговоры о японской анимации, атмосфера тёплого света и специальное предложение на рамэн. Показ фильма в программу не входит.",
    originalDate: "16 апреля 1988",
    source: "https://www.ghibli.jp/works/hotarunohaka/",
    cover:
      "https://www.film.ru/sites/default/files/images/Grave-Of-The-Fireflies-01.jpg",
  },
  {
    id: "howl",
    theme: "howl",
    kanji: "城",
    number: "22",
    title: "22 года «Ходячему замку»",
    subtitle: "Немного магии в каждом блюде",
    category: "ФАНТАЗИЯ · ГОДОВЩИНА",
    start: "2026-11-20",
    end: "2026-11-22",
    date: "20–22 ноября",
    offer: "−22% на роллы",
    description:
      "20 ноября исполняется 22 года со дня японской премьеры истории о волшебном замке. Повод добавить в обычный вечер немного сказки.",
    details:
      "Тематические оформления столов, уголок для фотографий, разговоры о любимых фантастических историях и специальная акция на роллы.",
    originalDate: "20 ноября 2004",
    source: "https://www.ghibli.jp/works/howl/",
    cover: "https://www.ghibli.jp/gallery/howl005.jpg",
  },
  {
    id: "death-note",
    theme: "note",
    kanji: "謎",
    number: "20",
    title: "20 лет аниме «Тетрадь смерти»",
    subtitle: "Сможешь раскрыть загадку?",
    category: "АНИМЕ · ИГРОВОЙ ВЕЧЕР",
    start: "2026-11-27",
    end: "2026-11-29",
    date: "27–29 ноября",
    offer: "−20% на гёдза",
    description:
      "В 2006 году началась история одного из самых обсуждаемых аниме-триллеров. Отмечаем двадцатилетие тематическими загадками.",
    details:
      "Вопросы на логику, мини-викторина о жанре детектива и атмосфера загадочного вечера. Участие в играх бесплатное, заказ еды по желанию.",
    originalDate: "Октябрь 2006",
    source: "https://www.ntv.co.jp/deathnote/",
    cover:
      "https://static.tildacdn.com/tild3635-6538-4332-a333-376333313632/-3.png",
  },
  {
    id: "your-name",
    theme: "comet",
    kanji: "星",
    number: "10",
    title: "10 лет «Твоему имени»",
    subtitle: "Встречи не бывают случайными",
    category: "КИНО · РОМАНТИКА",
    start: "2026-12-04",
    end: "2026-12-06",
    date: "4–6 декабря",
    offer: "Два матча за 490 сом",
    description:
      "Десять лет со дня премьеры романтической истории Макото Синкая. Собираемся ради красивых воспоминаний и новых встреч.",
    details:
      "Вечер открыток, пожеланий, атмосферных фотографий и тёплых напитков. Можно прийти вдвоём или познакомиться с единомышленниками.",
    originalDate: "26 августа 2016",
    source: "https://jfdb.jp/en/title/6450",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaVn-GTtkjGXwyB_bKJxtNz8fcmPB3XT_GV_mxdthSX74ukBixqPiBR4U&s=10",
  },
];

export function getEventStatus(event, now = Date.now()) {
  const start = new Date(`${event.start}T00:00:00+06:00`).getTime();
  const end = new Date(`${event.end}T23:59:59+06:00`).getTime();

  if (now < start) return "upcoming";
  if (now <= end) return "live";

  return "past";
}

export function getFeaturedEvents(now = Date.now()) {
  const current = events.filter(
    (event) => getEventStatus(event, now) !== "past",
  );

  return (current.length ? current : [...events].reverse()).slice(0, 3);
}
