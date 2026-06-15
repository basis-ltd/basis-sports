# basis-sports API

NestJS backend for the football analytics platform.

## Prerequisites

- Node.js 20+
- PostgreSQL (`basis_sports_dev` database)

## Setup

```bash
cd server
cp .env.example .env
# Edit DATABASE_URL in .env
npm install
npm run seed
```

## Run

```bash
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/health

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start with hot reload |
| `npm run seed` | Seed FIFA World Cup 2026 demo data |
| `npm run build` | Compile TypeScript |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |

## Phase 1 Endpoints (planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tournaments` | List tournaments |
| GET | `/seasons` | List seasons (`tournamentId`) |
| GET | `/players` | Search players (`search`, `position`, `teamId`) |
| GET | `/matches` | List matches (`seasonId`, `teamId`) |
| GET | `/heatmap` | Zone heatmap (`playerId`, `seasonId`, `matchIds[]`) |

Routes use flat paths (no `/api` prefix) per project spec.

## Environment

See `.env.example`. `DATABASE_URL` is required. `TYPEORM_SYNCHRONIZE` is disabled automatically in production.