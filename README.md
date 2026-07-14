# Delivery Order App

Простое веб-приложение для приёмки заказов на доставку.

- **Backend**: ASP.NET 9, Entity Framework Core, PostgreSQL
- **Frontend**: React + TypeScript (Vite)

## Функционал

1. Создание нового заказа (город/адрес отправителя и получателя, вес груза, дата забора)
2. Список всех заказов с автоматически сгенерированным номером
3. Просмотр одного заказа в режиме только для чтения

## Запуск через Docker (рекомендуется)

Требуется установленный Docker и Docker Compose.

```bash
docker compose up --build
```

После сборки будут доступны:

- Frontend: http://localhost:5173
- Backend / Swagger: http://localhost:5220/swagger

База данных PostgreSQL поднимается автоматически в отдельном контейнере, миграции применяются при старте backend'а. Остановить и удалить контейнеры:

```bash
docker compose down
```

Чтобы удалить вместе с данными БД:

```bash
docker compose down -v
```

## Запуск без Docker (вручную)

### Требования

- .NET 9 SDK
- Node.js 18+
- Локальный PostgreSQL (или любой доступный инстанс)

### 1. Backend

```bash
cd TestApp
```

Пропиши свою строку подключения в `appsettings.json` (или `appsettings.Development.json`) в секции `ConnectionStrings.DefaultConnection`, затем накати миграции:

```bash
dotnet ef database update
```

Запусти backend:

```bash
dotnet run
```

Backend поднимется на `http://localhost:5220` (порт может отличаться — смотри вывод в консоли), Swagger — на `http://localhost:5220/swagger`.

### 2. Frontend

```bash
cd TestAppFront
npm install
cp .env.example .env
npm run dev
```

Frontend поднимется на `http://localhost:5173`. Адрес backend'а для запросов берётся из `VITE_API_BASE_URL` в `.env` (по умолчанию `http://localhost:5220/api`).

## Структура репозитория

```
TestApp/            # backend (ASP.NET 9 + EF Core)
TestAppFront/        # frontend (React + TypeScript + Vite)
docker-compose.yml
```