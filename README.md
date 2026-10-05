# 🗺️ Map App

Современное веб-приложение для интерактивного исследования, добавления и обмена локациями на базе **Яндекс Карт (API 3.0)**, разработанное на стеке **Nuxt 4**, **Vue 3**, **Tailwind CSS v4**, **Prisma** и **Lucia Auth**.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Lucia](https://img.shields.io/badge/Auth-Lucia_v3-5f57ff)](https://lucia-auth.com/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-fbf0df?logo=bun&logoColor=black)](https://bun.sh/)

---

## 📑 Содержание

- [Обзор проекта](#-обзор-проекта)
- [Ключевые возможности](#-ключевые-возможности)
- [Стек технологий](#-стек-технологий)
- [Архитектура и структура проекта](#-архитектура-и-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
  - [Требования](#требования)
  - [Установка и запуск](#пошаговая-установка)
- [Переменные окружения](#-переменные-окружения)
- [Схема базы данных](#-схема-базы-данных)
- [Доступные скрипты](#-доступные-скрипты)
- [Стандарты кода и CI/CD](#-стандарты-кода-и-cicd)
- [Лицензия и автор](#-лицензия)

---

## 🔭 Обзор проекта

**Map App** предоставляет удобный интерфейс для поиска интересных мест, публикации собственных геолокаций с фотографиями и описанием, прокладки автомобильных/пеших маршрутов прямо на карте и формирования личной коллекции избранных точек.

Проект спроектирован с упором на производительность, строгую типизацию, реактивность состояния и современный UX (поддержка светлой и тёмной темы, плавные переходы, мобильная адаптивность).

---

## ✨ Ключевые возможности

### 🗺️ Интерактивная карта (Яндекс Карты API 3.0)

- **Кластеризация маркеров:** Автоматическое объединение близких точек с плавной анимацией зума при клике (`@yandex/ymaps3-clusterer`).
- **Синхронизация тем оформления:** Автоматическое переключение векторной схемы карты под активную тему интерфейса (светлая/тёмная).
- **Определение местоположения:** Встроенная поддержка Geolocation API для центрирования карты и расчета расстояний.
- **Глубокая адресация (Deep Linking):** Быстрый переход к конкретной точке по URL (`/?location=<slug>`) с автоматической фокусировкой и открытием карточки.

### 📍 Создание и управление локациями

- **Добавление метки на карте:** Возможность выбора координат двойным кликом либо перетаскиванием драфт-маркера (`DraftMarker`).
- **Валидация форм:** Строгая проверка клиентских и серверных входных данных через **Zod** и **VeeValidate**.
- **Мультимедиа (UploadThing):** Загрузка до 5 фотографий (до 4 МБ каждая), интерактивный Drag & Drop, сортировка порядка фотографий с помощью `vue-draggable-plus`, превью и удаление до публикации.

### 🚗 Маршрутизация

- **Yandex Maps Router API:** Построение оптимального маршрута от текущей геолокации пользователя до выбранной метки в один клик.
- Визуальное отображение трека маршрута с кастомной стилизацией на слое `YandexMapFeature`.

### 🔍 Поиск и умный сайдбар

- **Поиск на лету:** Фильтрация точек по названию и детальному описанию.
- **Ближайшие места:** Автоматический расчет дистанции от текущей позиции пользователя по формуле Haversine и вывод ближайших объектов (в радиусе 10 км).
- **Адаптивный сайдбар:** Сворачиваемая панель навигации (shadcn-sidebar), оптимизированная под десктопные и мобильные экраны.

### 👤 Пользователи и безопасность

- **Сессионная аутентификация:** Полноценный цикл регистрации, входа и выхода через **Lucia Auth** с использованием защищенных `HttpOnly` Cookie.
- **Хеширование паролей:** Криптографический алгоритм **Argon2id**.
- **Кэширование сессий:** Изолированный кэш сессии в рамках одного HTTP-запроса (`event.context`) для исключения избыточных запросов к БД и защиты от утечек.
- **Личный кабинет и профили:** Публичные страницы авторов (`/profile/[username]`), просмотр созданных локаций, управление списком избранного и редактирование профиля.

---

## 🛠️ Стек технологий

| Категория             | Технологии                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Фреймворк**         | [Nuxt 4](https://nuxt.com/) (SSR/SSG/SPA Hybrid), [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup>`)                                                                   |
| **Язык**              | [TypeScript](https://www.typescriptlang.org/) (строгий режим)                                                                                                                         |
| **Стилизация**        | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`), CSS-переменные в палитре OKLCH                                                                                     |
| **UI-компоненты**     | [shadcn-vue / shadcn-nuxt](https://shadcn-vue.com/), [Reka UI](https://reka-ui.com/)                                                                                                  |
| **Карты**             | [vue-yandex-maps](https://vue-yandex-maps.crawand.dev/) (API 3.0), `@yandex/ymaps3-clusterer`, `@yandex/ymaps3-default-ui-theme`                                                      |
| **Стейт-менеджмент**  | [Pinia](https://pinia.vuejs.org/) + `@pinia/nuxt`                                                                                                                                     |
| **Формы и валидация** | [VeeValidate 4](https://vee-validate.logaretm.com/), [Zod 4](https://zod.dev/)                                                                                                        |
| **База данных и ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 6](https://www.prisma.io/), `@prisma/extension-accelerate`                                                                     |
| **Аутентификация**    | [Lucia Auth v3](https://lucia-auth.com/), `@lucia-auth/adapter-prisma`, [Argon2](https://github.com/ranisalt/node-argon2)                                                             |
| **Хранилище файлов**  | [UploadThing](https://uploadthing.com/) (`uploadthing`, `@uploadthing/vue`)                                                                                                           |
| **Иконки и шрифты**   | [Lucide](https://lucide.dev/), `@nuxt/icon` (Tabler Icons), `@nuxt/fonts` (шрифты Tektur, Space-Mono)                                                                                 |
| **Инструменты**       | [Bun](https://bun.sh/), [ESLint](https://eslint.org/) (`@antfu/eslint-config`), [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged) |

---

## 📁 Архитектура и структура проекта

Проект организован по модульной структуре Nuxt 4 с четким разделением клиентского и серверного слоев:

```text
map-app/
├── app/                          # Клиентская часть приложения (Nuxt 4 app directory)
│   ├── assets/                   # Стили (main.css с Tailwind v4 и дизайн-токенами)
│   ├── components/               # Vue компоненты
│   │   ├── app/                  # Компоненты каркаса (Header, Sidebar, ThemeToggle)
│   │   ├── auth/                 # Компоненты аутентификации
│   │   ├── location/             # Компоненты локаций (карта, маркеры, попапы, формы)
│   │   ├── profile/              # Компоненты страниц профиля и списков
│   │   ├── shared/               # Переиспользуемые элементы (индикаторы, скелетоны)
│   │   ├── ui/                   # Базовые UI компоненты shadcn (button, input, form и др.)
│   │   └── uploadthing/          # Компоненты загрузки и превью файлов
│   ├── composables/              # Композаблы (useMapController, useRouteBuilder, useSeo...)
│   ├── layouts/                  # Лейауты (default, auth, main)
│   ├── pages/                    # Маршрутизация Nuxt
│   │   ├── (auth)/               # Роуты авторизации и главная страница карты (/)
│   │   └── (main)/profile/       # Профиль пользователя (/profile, /profile/[username])
│   └── utils/                    # Клиентские утилиты (расчет дистанции, генерация slug)
├── lib/                          # Общие библиотеки и конфигурации
│   ├── env/                      # Zod-схема и строгая проверка переменных окружения
│   ├── prisma.ts                 # Инициализация синглтона PrismaClient с Accelerate
│   ├── types/                    # TypeScript типы и Zod-схемы валидации
│   └── uploadthing.ts            # Клиентские хелперы UploadThing
├── prisma/                       # Prisma схема и миграции базы данных
│   ├── migrations/               # SQL миграции
│   └── schema.prisma             # Модели (User, Session, Location, LocationImage...)
├── public/                       # Статические ассеты (шрифты, favicon)
├── server/                       # Серверная часть (Nuxt Nitro / H3)
│   ├── api/                      # Серверные эндпоинты
│   │   ├── auth/                 # Вход, регистрация, выход (POST /api/auth/*)
│   │   ├── favorites/            # Управление избранным (GET/POST/DELETE /api/favorites/*)
│   │   ├── locations/            # CRUD локаций (GET/POST/DELETE /api/locations/*)
│   │   ├── uploadthing/          # Обработчик загрузок UploadThing
│   │   └── user/                 # Данные пользователя (GET/PATCH /api/user/*)
│   ├── uploadthing.ts            # Конфигурация FileRouter UploadThing
│   └── utils/                    # Серверные утилиты (аутентификация Lucia, кэш)
├── stores/                       # Pinia хранилища (auth, location, popup, route, geolocation)
├── .github/workflows/lint.yaml   # CI пайплайн GitHub Actions
├── nuxt.config.ts                # Конфигурация Nuxt 4 и подключенных модулей
├── package.json                  # Скрипты и зависимости
└── tsconfig.json                 # Конфигурация TypeScript
```

---

## 🚀 Быстрый старт

### Требования

Для запуска проекта на локальной машине убедитесь, что у вас установлены:

- **[Bun](https://bun.sh/)** (версия 1.1 или выше) — основной пакетный менеджер проекта
- **[PostgreSQL](https://www.postgresql.org/)** (версия 14 или выше) либо облачная БД (Neon, Supabase, Prisma Accelerate)
- Активные API-ключи:
  - **Яндекс Карты (JavaScript API 3.0)**
  - **Яндекс Карты (Router API)**
  - **UploadThing Token**

---

### Пошаговая установка

#### 1. Клонирование репозитория

```bash
git clone https://github.com/Woohda/map-app.git
cd map-app
```

#### 2. Установка зависимостей

```bash
bun install
```

#### 3. Настройка переменных окружения

Скопируйте пример файла конфигурации:

```bash
cp .env.example .env
```

Заполните переменные в созданном файле `.env` (подробнее в разделе [Переменные окружения](#-переменные-окружения)).

#### 4. Миграции базы данных и генерация Prisma Client

Примените миграции к вашей базе данных PostgreSQL и сгенерируйте клиент:

```bash
# Применение существующих миграций
bunx prisma migrate dev

# Генерация Prisma Client
bunx prisma generate
```

#### 5. Запуск сервера разработки

```bash
bun run dev
```

Приложение будет доступно по адресу: **`http://localhost:3000`**

---

## ⚙️ Переменные окружения

Все переменные окружения валидируются при старте приложения с помощью **Zod** (`lib/env/env.ts`). Если какая-либо обязательная переменная отсутствует или некорректна, приложение выбросит явную ошибку при запуске.

| Переменная                   | Обязательная | Описание                                           | Пример значения                                     |
| ---------------------------- | :----------: | -------------------------------------------------- | --------------------------------------------------- |
| `PRISMA_DATABASE_URL`        |    **Да**    | Строка подключения к базе данных PostgreSQL        | `postgresql://user:password@localhost:5432/map_app` |
| `YANDEX_MAPS_API_KEY`        |    **Да**    | API-ключ для JavaScript API Яндекс Карт 3.0        | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`              |
| `YANDEX_MAPS_ROUTER_API_KEY` |    **Да**    | API-ключ сервиса маршрутизации Яндекс Карт         | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`              |
| `UPLOADTHING_TOKEN`          |    **Да**    | Секретный токен приложения UploadThing             | `eyJhcGlLZXkiOi...`                                 |
| `SITE_URL`                   |    **Да**    | Базовый публичный URL сайта (для SEO и мета-тегов) | `http://localhost:3000`                             |
| `NODE_ENV`                   |     Нет      | Режим окружения (`development` / `production`)     | `development`                                       |

### Как получить ключи:

- **Яндекс Карты & Router API:** зарегистрируйтесь в [Кабинете разработчика Яндекс Карт](https://developer.tech.yandex.ru/), создайте проект и подключите тарифы _"JavaScript API и HTTP Геокодер"_ и _"Матрица расстояний и Маршрутизация"_.
- **UploadThing:** создайте бесплатный проект на [UploadThing Dashboard](https://uploadthing.com/dashboard) и скопируйте токен в разделе API Keys.

---

## 🗄️ Схема базы данных

База данных управляется через Prisma ORM (`prisma/schema.prisma`). Основные сущности:

- **`User`** — профиль пользователя (email, уникальный username, name, avatarUrl, bio, passwordHash).
- **`Session`** — активные сессии пользователя, управляемые Lucia Auth.
- **`Location`** — добавленные локации с гео-координатами (`latitude`, `longitude`), названием, уникальным `slug` и автором.
- **`LocationImage`** — фотографии локаций, связанные с ключами в хранилище UploadThing с поддержкой порядка сортировки (`order`).
- **`FavoriteLocation`** — избранные локации пользователя (связь many-to-many с ограничением уникальности `[userId, locationId]`).
- **`LocationLog`** и **`LocationLogImage`** — трекинг посещений локаций со статусами (`CHECK_IN`, `CHECK_OUT`, `ABORTED`).
- **`Comment`** — древовидная система комментариев и оценок к местам (с поддержкой вложенных ответов `replies`).

---

## 📜 Доступные скрипты

В проекте настроены следующие скрипты запуска (выполняются через `bun <команда>`):

| Скрипт                | Описание                                                    |
| --------------------- | ----------------------------------------------------------- |
| `bun run dev`         | Запуск локального сервера разработки с поддержкой HMR       |
| `bun run build`       | Генерация Prisma Client и сборка продакшен-бандла Nuxt      |
| `bun run preview`     | Локальный запуск собранного продакшен-приложения            |
| `bun run generate`    | Статическая генерация страниц (SSG)                         |
| `bun run postinstall` | Подготовка типов Nuxt (`nuxt prepare`)                      |
| `bun run lint`        | Проверка кодовой базы через ESLint                          |
| `bun run lint:fix`    | Автоматическое исправление ошибок форматирования и линтинга |
| `bun run prepare`     | Инициализация Git-хуков Husky                               |

---

## 🧪 Стандарты кода и CI/CD

В проекте поддерживаются строгие стандарты качества кода и типизации:

- **ESLint & Форматирование:** Конфигурация `@antfu/eslint-config` с правилами Nuxt, сортировкой импортов `perfectionist`, контролем регистра файлов `unicorn/filename-case` и проверкой безопасности `node/no-process-env`.
- **Git Hooks:** Использование **Husky** и **lint-staged** для автоматической проверки и автоисправления форматирования перед каждым коммитом (`bun lint:fix`).
- **CI Пайплайн:** В `.github/workflows/lint.yaml` настроен автоматический запуск проверки типов, сборки и ESLint при создании Pull Request в ветку `main`.
- **Документирование кода:** Архитектурные модули, утилиты и хранилища сопровождаются детализированными JSDoc-описаниями с разбором зависимостей и сценариев использования.

---

## 📄 Лицензия

Проект распространяется для личного и образовательного использования (Pet Project).
Автор: **[Woohda](https://github.com/Woohda)**.
