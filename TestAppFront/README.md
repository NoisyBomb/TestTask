# Delivery Order App — фронтенд

React + TypeScript SPA для приёмки заказов на доставку. Работает поверх готового backend'а на ASP.NET 9 (см. Swagger backend'а для сверки эндпоинтов).

Три экрана:

- `/` — список всех заказов
- `/new` — форма создания нового заказа
- `/orders/:id` — просмотр заказа (только чтение)

## Стек

- React 18 + TypeScript
- Vite
- react-router-dom
- обычный `fetch` (без axios)

## Требования

- Node.js 18+ и npm
- Запущенный backend (см. корневой README проекта / папку `backend`)

## Установка и запуск

```bash
cd frontend
npm install
cp .env.example .env   # при необходимости поправьте адрес backend'а
npm run dev
```

Приложение поднимется на `http://localhost:5173`. Backend должен быть запущен и слушать адрес, указанный в `VITE_API_BASE_URL` (по умолчанию `http://localhost:5220/api`).

> CORS на backend уже настроен на `http://localhost:5173` — если фронтенд запускается на другом порту, нужно будет поправить настройку CORS на бэкенде.

### Переменные окружения

| Переменная | Назначение | Значение по умолчанию |
|---|---|---|
| `VITE_API_BASE_URL` | Базовый адрес backend API | `http://localhost:5220/api` |

## Сборка для продакшена

```bash
npm run build
```

Собранные статические файлы появятся в `dist/`. Локально проверить сборку можно через `npm run preview`.

## Проверка типов

```bash
npm run lint
```

## Структура проекта

```
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env.example
└── src/
    ├── main.tsx
    ├── App.tsx              # роутинг и общий шелл (шапка, навигация)
    ├── index.css
    ├── types.ts             # типы Order / NewOrderPayload
    ├── api/
    │   └── ordersApi.ts     # весь fetch-код к backend в одном месте
    ├── components/
    │   ├── OrderStamp.tsx   # бейдж номера заказа
    │   └── StatusBanner.tsx # состояния загрузки / ошибки / пустого списка
    └── pages/
        ├── OrdersListPage.tsx
        ├── NewOrderPage.tsx
        └── OrderDetailsPage.tsx
```

## Что реализовано

- Список заказов с состояниями загрузки, сетевой ошибки и пустого списка
- Создание заказа с клиентской валидацией (обязательные поля, вес > 0) и отображением серверных ошибок валидации (`400`, `ValidationProblemDetails`)
- Просмотр одного заказа в режиме только для чтения, с обработкой `404`
- Единая точка обращения к API (`src/api/ordersApi.ts`), разделение сетевых ошибок и ошибок валидации

## Что не входит (по заданию)

- Редактирование и удаление заказов
- Аутентификация/авторизация
- Пагинация списка
