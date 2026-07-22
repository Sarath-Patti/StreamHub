# StreamHub

Production-ready foundation for a modern full-stack streaming platform.

## Engineering Foundation

StreamHub follows clean engineering practices:

- **Structured Logging**: Powered by Pino with request ID tracing.
- **Environment & Input Validation**: Powered by Zod with fail-fast startup checks.
- **Centralized Error System**: Standardized application error hierarchy and sanitized GraphQL error responses.
- **Request Lifecycle**: Express middleware pipeline for Request ID, logging, auth context preparation, and global error handling.
- **Testing Infrastructure**: Configured with Vitest for unit and integration testing.

For detailed documentation, see [docs/engineering.md](docs/engineering.md) and [docs/architecture.md](docs/architecture.md).

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

## Project Structure

```
streamhub/
├── frontend/             # React 19 + Vite + TypeScript + Tailwind CSS
├── backend/              # Express + Apollo Server + Prisma ORM + Pino + Zod
├── shared/               # Shared constants, types, errors, validation, and logger
├── docs/                 # Architectural & engineering documentation
├── docker/               # Container configurations
├── scripts/              # Build and utility scripts
├── .github/workflows/    # CI/CD workflows
├── README.md
├── LICENSE
└── .gitignore
```

## License

[MIT](LICENSE)
