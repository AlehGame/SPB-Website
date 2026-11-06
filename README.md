# Cool Print SPB

Верстка сайта по макету Figma. Стек: Vite + React + TypeScript, Tailwind CSS, GSAP + ScrollTrigger + Lenis.

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
3. **Секрет.** `npx wrangler secret put SANITY_WRITE_TOKEN --config wrangler.toml` и вставьте токен.
4. **Деплой.** `npm run deploy` (внутри `wrangler deploy --config wrangler.toml`). В конце будет адрес вида `https://coolprint-contact.<аккаунт>.workers.dev`.
5. **Сайт.** Впишите этот адрес в [.env](.env): `VITE_CONTACT_ENDPOINT=https://coolprint-contact.<аккаунт>.workers.dev`, закоммитьте и запушьте. Сайт пересоберётся.
6. **Studio.** Из папки `studio/`: `npx sanity deploy`, чтобы в ней появилось поле «Обработана».

Письмо на почту (необязательно): зарегистрируйтесь на resend.com, создайте API key и выполните в `worker/`: `npx wrangler secret put RESEND_API_KEY --config wrangler.toml` и `npx wrangler secret put NOTIFY_EMAIL --config wrangler.toml` (почта, на которую зарегистрирован Resend), затем снова `npm run deploy`. Письма идут с адреса onboarding@resend.dev; для своего домена его нужно подтвердить в Resend.

Уведомление в Telegram (необязательно): в Telegram напишите @BotFather, команда `/newbot`, получите токен бота. Затем откройте чат с новым ботом и нажмите Start (для группы добавьте бота в группу и напишите там любое сообщение). Узнайте chat id: откройте `https://api.telegram.org/bot<токен>/getUpdates` и найдите `"chat":{"id":...}`. В `worker/` выполните `npx wrangler secret put TELEGRAM_BOT_TOKEN` и `npx wrangler secret put TELEGRAM_CHAT_ID`, затем `npx wrangler deploy`. Фото стены приходит в Telegram вместе с текстом заявки.

Если сайт переедет на другой адрес, добавьте его в `ALLOWED_ORIGINS` в [wrangler.toml](worker/wrangler.toml). Тесты Worker: `npm test` в папке `worker/`.

## SEO

Адрес сайта задаётся в `.env`: `VITE_SITE_URL` (со слэшем в конце). Из него берутся canonical, Open Graph, `robots.txt` и `sitemap.xml` (генерируются при сборке, см. [vite.config.ts](vite.config.ts)). Мета-теги и микроразметка LocalBusiness лежат в [index.html](index.html), FAQPage строится из вопросов в секции «Частые вопросы».

Когда у сайта появится свой домен:
1. Обновите `VITE_SITE_URL` в `.env` и добавьте домен в `ALLOWED_ORIGINS` в [worker/wrangler.toml](worker/wrangler.toml) (затем `npm run deploy` в папке `worker/`).
2. Подтвердите сайт в Яндекс Вебмастере и Google Search Console (мета-тег подтверждения добавляется в `<head>` в `index.html`) и отправьте `sitemap.xml`.
3. `robots.txt` учитывается поисковиками только в корне домена, на `github.io/<репозиторий>/` он не работает.

## Хостинг Timeweb

Пошаговая инструкция по переносу сайта и подготовке домена: [TIMEWEB.md](TIMEWEB.md). Сборка под домен: `.\scripts\build-timeweb.ps1 -Domain ваш-домен.ru`.


> **Важно: команды wrangler для формы.** Сборка сайта (
pm run build в корне) создаёт файл .wrangler/deploy/config.json, из-за которого wrangler в папке worker/ может взять конфиг сайта (корневой wrangler.jsonc) вместо конфига формы и задеплоить не то. Поэтому все команды для Worker запускайте с `--config wrangler.toml` (скрипты 
pm run deploy, 
pm run tail, 
pm run dev в worker/ уже так настроены).

## Закрытый датасет для заявок (важно для безопасности)

Датасет `production` в Sanity публичный: сайт читает кейсы и отзывы без токена. Из-за этого **любой документ в нём может прочитать кто угодно** через публичный API, в том числе имена и телефоны из заявок. Поэтому заявки хранятся в отдельном **закрытом** датасете `private`, а Studio разделена на две рабочие области: «Cool Print: сайт» (кейсы, отзывы) и «Cool Print: заявки» (переключатель в левом верхнем углу).

Однократная настройка (порядок важен):

1. В папке `studio/`: `npx.cmd sanity dataset create private --visibility private`.
2. Задеплойте Worker: в папке `worker/` выполните `npm.cmd run deploy` (переменная `SANITY_CONTACT_DATASET=private` уже в [worker/wrangler.toml](worker/wrangler.toml)).
3. Задеплойте Studio: в папке `studio/` выполните `npx.cmd sanity deploy`.
4. Удалите старые заявки из публичного датасета `production`: в Studio их больше не видно, а через API они остаются доступны. Команда в папке `studio/`: `npx.cmd sanity documents query "*[_type == 'contactRequest']._id" --dataset production`, затем удалите найденные документы командой `npx.cmd sanity documents delete <id> --dataset production`.
