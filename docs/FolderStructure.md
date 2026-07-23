# StreamHub Directory & Folder Structure

```
StreamHub/
├── backend/
│   ├── prisma/
│   │   ├── migrations/      # Database migrations
│   │   └── seed.ts          # Seed catalog script (40 items across 10 genres)
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── modules/         # Feature modules (auth, catalog, watchlist, reviews, search, recommendation, admin)
│   │   ├── shared/          # Middleware, utilities, errors, logging
│   │   └── index.ts         # Entry point (Express + Apollo Server)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components by domain (analytics, auth, collections, discover, intelligence, search, ui)
│   │   ├── config/          # App, feature flags, and environment configs
│   │   ├── graphql/         # Operations, client setup, and cache typePolicies
│   │   ├── hooks/           # Custom React hooks (useAnalytics, useAuth, useCollections, useCollection, useSearch)
│   │   ├── layouts/         # RootLayout, Navbar
│   │   ├── pages/           # Route pages (Analytics, CollectionDetails, Collections, ContentDetails, Discover, Home, Login, Register, SearchDashboard)
│   │   ├── services/        # Service layer (analytics, collection, logger, performance, recommendation, search)
│   │   ├── types/           # Domain TypeScript types
│   │   └── App.tsx          # Main router with React.lazy code-splitting
│   └── package.json
├── docs/                    # Architectural & engineering documentation
├── docker-compose.yml       # Docker Compose setup
└── README.md
```
