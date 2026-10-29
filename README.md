# Cool Print SPB

Верстка сайта по макету Figma. Стек: Vite + React + TypeScript, Tailwind CSS, GSAP + ScrollTrigger + Lenis, Swiper.

## Запуск

```
npm install
npm run dev      # разработка
npm run build    # production-сборка в dist/
```

## Деплой

При каждом пуше в `main` GitHub Actions ([deploy.yml](.github/workflows/deploy.yml)) собирает сайт и публикует его на GitHub Pages: https://alehgame.github.io/SPB-Website/

## Sanity CMS (секции «Кейсы» и «Клиенты говорят»)

Содержимое хранится в Sanity (проект `fy6hrt2t`, датасет `production`): карточки проектов (изображение, заголовок, локация, квадратура) и видео-отзывы (видеофайл и необязательное название). Клиент добавляет и удаляет их в Studio, сайт подтягивает данные при загрузке страницы, пересборка не нужна. Project ID уже прописан в [.env](.env) и в [studio/](studio/).

Разовая настройка (из папки `studio/`, нужен аккаунт Sanity с доступом к проекту):

1. `npm install`, затем `npx sanity login`.
2. CORS для сайта: `npx sanity cors add https://alehgame.github.io` и `npx sanity cors add http://localhost:5173` (без credentials).
3. Стартовые проекты: `npx sanity exec scripts/seed.ts --with-user-token` (загружает пять текущих карточек и три видео-отзыва).
4. Студия для клиента: `npx sanity deploy` (адрес вида `https://<имя>.sanity.studio`; на вопрос про хост введите, например, `coolprint`). Приглашение клиента: sanity.io/manage, раздел Members.

Пока в Sanity нет проектов или видео-отзывов, не настроен CORS или Sanity недоступен, показываются запасные: проекты из [portfolio.ts](src/lib/portfolio.ts), видео из [reviews.ts](src/lib/reviews.ts).
