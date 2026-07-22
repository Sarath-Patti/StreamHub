# StreamHub Architecture

This document details the layered architectural model of the StreamHub application.

## End-to-End Data Flow

Data flows sequentially through the application layers as follows:

```
Frontend -> Apollo Client -> GraphQL API -> Service Layer -> Repository Layer -> PostgreSQL
```

## Layer Descriptions

### 1. Frontend
The client application built with React 19, TypeScript, Vite, and Tailwind CSS. Manages application presentation, routing, and user interface state.

### 2. Apollo Client
The data management layer on the client. Handles GraphQL query execution, response caching, and HTTP transport layer communication with the backend.

### 3. GraphQL API
The central API surface built using Apollo Server on top of Express. Exposes defined GraphQL schemas and delegates field resolution to down-stream services.

### 4. Service Layer
Contains core application domain interfaces, workflow orchestration, and business logic abstractions. Keeps resolvers lean and protocol-agnostic.

### 5. Repository Layer
Abstracts data persistence operations using Prisma ORM. Directly handles interaction with the database, isolating database queries from higher-level services.

### 6. PostgreSQL
The primary relational database providing reliable, persistent storage for system data.
