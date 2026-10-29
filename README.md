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

## Форма заявок: Cloudflare Worker + Sanity

Сайт статический, поэтому токен записи Sanity в нём хранить нельзя. Форма отправляет заявку на небольшой Cloudflare Worker ([worker/](worker/)), он проверяет данные, загружает фото стены и создаёт документ «Заявка с сайта» в Sanity. Клиент видит заявки в Studio (раздел «Заявка с сайта», отметка «Обработана»), а при желании получает письмо на почту.

Разовая настройка:

1. **Токен Sanity.** sanity.io/manage → проект → API → Tokens → Add API token, права **Editor**. Скопируйте токен (он показывается один раз).
2. **Cloudflare.** Бесплатный аккаунт на cloudflare.com. Из папки `worker/`: `npm install`, `npx wrangler login`.
3. **Секрет.** `npx wrangler secret put SANITY_WRITE_TOKEN` и вставьте токен.
4. **Деплой.** `npx wrangler deploy`. В конце будет адрес вида `https://coolprint-contact.<аккаунт>.workers.dev`.
5. **Сайт.** Впишите этот адрес в [.env](.env): `VITE_CONTACT_ENDPOINT=https://coolprint-contact.<аккаунт>.workers.dev`, закоммитьте и запушьте. Сайт пересоберётся.
6. **Studio.** Из папки `studio/`: `npx sanity deploy`, чтобы в ней появилось поле «Обработана».

Письмо на почту (необязательно): зарегистрируйтесь на resend.com, создайте API key и выполните в `worker/`: `npx wrangler secret put RESEND_API_KEY` и `npx wrangler secret put NOTIFY_EMAIL` (почта, на которую зарегистрирован Resend), затем снова `npx wrangler deploy`. Письма идут с адреса onboarding@resend.dev; для своего домена его нужно подтвердить в Resend.

Если сайт переедет на другой адрес, добавьте его в `ALLOWED_ORIGINS` в [wrangler.toml](worker/wrangler.toml). Тесты Worker: `npm test` в папке `worker/`.
