# StreamHub Developer Guide

Welcome to the StreamHub developer guide! This document outlines local setup, developer scripts, and coding conventions.

## Quick Setup

### One-Command Docker Startup (Recommended)
```bash
git clone https://github.com/Sarath-Patti/StreamHub.git
cd StreamHub
docker compose up --build
```

### Manual Monorepo Setup
```bash
# 1. Install root dependencies
npm install

# 2. Setup database
cd backend
npx prisma db push
npx prisma db seed

# 3. Start development server
cd ..
npm run dev
```

## Monorepo Scripts

- `npm run dev`: Concurrent frontend (Vite) and backend (ts-node-dev) dev server.
- `npm run build`: Production build of frontend (`tsc && vite build`) and backend (`tsc`).
- `npm run test`: Executes test suite (`vitest`).
- `npm run lint`: Runs ESLint across frontend and backend.
- `npm run clean`: Cleans build artifacts and node_modules.

## Code Quality Standards

1. **No Business Logic in React**: Keep components presentation-focused. Place domain calculations in services.
2. **Centralized Logging**: Use `createLogger('ModuleName')` instead of `console.log`.
3. **Memoization**: Wrap expensive scoring/aggregation calls in `useMemo` or service caches.
