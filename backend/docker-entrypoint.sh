#!/bin/sh
set -e

echo "==> Generating Prisma Client..."
npx prisma generate

echo "==> Applying database schema..."
npx prisma db push --accept-data-loss

echo "==> Seeding database..."
npx prisma db seed || true

echo "==> Launching StreamHub Backend Server..."
exec node dist/index.js
