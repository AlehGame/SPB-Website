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

Карточки проектов хранятся в Sanity: изображение, заголовок, локация и квадратура. Клиент добавляет и удаляет их в Studio, сайт подтягивает данные при загрузке страницы, пересборка не нужна.

1. **Проект Sanity.** Зарегистрируйтесь на sanity.io и создайте проект (датасет `production`, доступ **Public**). Запишите Project ID.
2. **Studio.** В папке `studio/`: скопируйте `.env.example` в `.env`, вставьте Project ID, затем `npm install` и `npm run deploy`. Студия будет доступна по адресу вида `https://<имя>.sanity.studio` (его отдаёте клиенту).
3. **CORS.** В sanity.io/manage, раздел API, CORS origins, добавьте `https://alehgame.github.io` (без «Allow credentials») и `http://localhost:5173` для разработки.
4. **Сайт.** В репозитории GitHub, Settings, Secrets and variables, Actions, Variables, создайте `VITE_SANITY_PROJECT_ID` и `VITE_SANITY_DATASET`. Для локальной разработки скопируйте `.env.example` в `.env.local`.
5. Запустите деплой (пуш в `main` или Run workflow).

Пока `VITE_SANITY_PROJECT_ID` не задан или Sanity недоступен, показываются пять запасных проектов из [portfolio.ts](src/lib/portfolio.ts).
