# StreamHub

Production-ready foundation for a modern full-stack streaming platform.

## Architecture & Modules

StreamHub features a clean modular architecture:

- **Authentication Module**: JWT access and refresh token authentication with bcrypt password hashing.
- **Content Catalog Module**: Comprehensive catalog management for Movies, TV Series, Seasons, Episodes, and Genres with pagination, search, and trending filters.
- **Structured Logging**: Powered by Pino with request ID tracing.
- **Environment & Input Validation**: Powered by Zod with fail-fast startup checks.
- **Centralized Error System**: Standardized application error hierarchy and sanitized GraphQL error responses.
- **Testing Infrastructure**: Configured with Vitest for unit and integration testing.

For detailed documentation, see:
- [docs/catalog.md](docs/catalog.md)
- [docs/authentication.md](docs/authentication.md)
- [docs/engineering.md](docs/engineering.md)
- [docs/architecture.md](docs/architecture.md)

## Data Flow Architecture

```
Frontend (React 19 + Vite) -> Apollo Client -> GraphQL API (Apollo Server + Express) -> Service Layer -> Repository Layer -> PostgreSQL (Prisma ORM)
```

## Quick Start

### Docker Compose

Start the full stack (Frontend, Backend, PostgreSQL):

```bash
docker-compose up --build
```

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Seed Database

```bash
cd backend
npx prisma db seed
```

## Project Structure

```
streamhub/
├── frontend/             # React 19 + Vite + TypeScript + Tailwind CSS
├── backend/              # Express + Apollo Server + Prisma ORM + Pino + Zod + JWT
│   ├── src/
│   │   ├── config/       # Configuration & env validation
│   │   ├── graphql/      # GraphQL context & resolvers
│   │   ├── modules/      # Domain modules (auth, catalog, etc.)
│   │   ├── shared/       # Single source of truth for reusable infrastructure
│   │   └── server.ts     # Express/Apollo server startup
│   ├── prisma/           # Prisma schema & seed script
│   └── tests/            # Integration & unit test suites
├── docs/                 # Architectural, engineering, auth & catalog documentation
├── docker/               # Container configurations
├── scripts/              # Build and utility scripts
├── .github/workflows/    # CI/CD workflows
├── README.md
├── LICENSE
└── .gitignore
```

## License

[MIT](LICENSE)
