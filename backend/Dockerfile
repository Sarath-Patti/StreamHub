FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]
