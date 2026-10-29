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

## Sanity CMS (секция «Кейсы»)

Карточки проектов хранятся в Sanity (проект `fy6hrt2t`, датасет `production`): изображение, заголовок, локация и квадратура. Клиент добавляет и удаляет их в Studio, сайт подтягивает данные при загрузке страницы, пересборка не нужна. Project ID уже прописан в [.env](.env) и в [studio/](studio/).

Разовая настройка (из папки `studio/`, нужен аккаунт Sanity с доступом к проекту):

1. `npm install`, затем `npx sanity login`.
2. CORS для сайта: `npx sanity cors add https://alehgame.github.io` и `npx sanity cors add http://localhost:5173` (без credentials).
3. Стартовые проекты: `npx sanity exec scripts/seed.ts --with-user-token` (загружает пять текущих карточек).
4. Студия для клиента: `npx sanity deploy` (адрес вида `https://<имя>.sanity.studio`; на вопрос про хост введите, например, `coolprint`). Приглашение клиента: sanity.io/manage, раздел Members.

Пока в Sanity нет проектов, не настроен CORS или Sanity недоступен, показываются пять запасных проектов из [portfolio.ts](src/lib/portfolio.ts).
