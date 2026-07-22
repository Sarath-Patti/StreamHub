# StreamHub

Production-ready foundation for a modern full-stack streaming platform.

## Architecture

StreamHub follows a clean, modular architecture:

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
├── backend/              # Express + Apollo Server + Prisma ORM
├── docs/                 # Documentation
├── docker/               # Container configurations
├── scripts/              # Build and utility scripts
├── .github/workflows/    # CI/CD workflows
├── README.md
├── LICENSE
└── .gitignore
```

## License

[MIT](LICENSE)
