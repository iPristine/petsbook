#!/bin/sh

# Ждем готовности базы данных
echo "Waiting for database..."
sleep 10

# Применяем миграции
echo "Running migrations..."
npx prisma migrate deploy

# Запускаем приложение
echo "Starting application..."
npm run start:prod