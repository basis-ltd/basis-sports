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

## API Endpoints

Routes use flat paths (no `/api` prefix). All endpoints except `/health` and `/auth/signup|login|forgot-password|reset-password` require a **Bearer JWT**. Permission checks are controlled by `RBAC_ENFORCE` (recommended `true` in production).

### Authentication

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/auth/signup` | Public — `{ firstName, email, password }` |
| POST | `/auth/login` | Public — `{ email, password }` |
| POST | `/auth/forgot-password` | Public — `{ email }` |
| POST | `/auth/reset-password` | Public — `{ token, password }` |
| GET | `/auth/me` | Bearer JWT — returns user + permissions |

**Example login flow:**

```bash
# Sign up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alex","email":"alex@example.com","password":"SecurePass123!"}'

# Use accessToken on protected routes
curl http://localhost:3000/tournaments \
  -H "Authorization: Bearer <accessToken>"
```

New signups are assigned the `scout` role. Password reset emails are sent via [Resend](https://resend.com/docs/api-reference/introduction).

### Sports data

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/tournaments` | `tournaments:read` |
| GET | `/tournaments/:id` | `tournaments:read` |
| POST | `/tournaments` | `tournaments:manage` |
| PATCH | `/tournaments/:id` | `tournaments:manage` |
| DELETE | `/tournaments/:id` | `tournaments:manage` |
| GET | `/seasons` | `seasons:read` |
| GET | `/seasons/:id` | `seasons:read` |
| POST | `/seasons` | `seasons:manage` |
| PATCH | `/seasons/:id` | `seasons:manage` |
| DELETE | `/seasons/:id` | `seasons:manage` |
| GET | `/teams` | `teams:read` |
| GET | `/teams/:id` | `teams:read` |
| POST | `/teams` | `teams:manage` |
| PATCH | `/teams/:id` | `teams:manage` |
| DELETE | `/teams/:id` | `teams:manage` |
| GET | `/players` | `players:read` |
| GET | `/players/:id` | `players:read` |
| POST | `/players` | `players:manage` |
| PATCH | `/players/:id` | `players:manage` |
| DELETE | `/players/:id` | `players:manage` |
| GET | `/matches` | `matches:read` |
| GET | `/matches/:id` | `matches:read` |
| POST | `/matches` | `matches:manage` |
| PATCH | `/matches/:id` | `matches:manage` |
| DELETE | `/matches/:id` | `matches:manage` |
| GET | `/match-events` | `match-events:read` |
| GET | `/match-events/:id` | `match-events:read` |
| POST | `/match-events` | `match-events:manage` |
| PATCH | `/match-events/:id` | `match-events:manage` |
| DELETE | `/match-events/:id` | `match-events:manage` |
| GET | `/player-match-stats` | `player-match-stats:read` |
| GET | `/player-match-stats/:id` | `player-match-stats:read` |
| POST | `/player-match-stats` | `player-match-stats:manage` |
| PATCH | `/player-match-stats/:id` | `player-match-stats:manage` |
| DELETE | `/player-match-stats/:id` | `player-match-stats:manage` |
| GET | `/heatmap` | `heatmap:read` |

### User management

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/users` | `users:manage` |
| GET | `/users/:id` | `users:manage` |
| GET | `/users/:id/roles` | `users:manage` |
| POST | `/users/:id/roles` | `users:manage` |
| DELETE | `/users/:id/roles` | `users:manage` |
| GET | `/roles` | `roles:manage` |
| GET | `/roles/:id` | `roles:manage` |
| POST | `/roles/:id/permissions` | `roles:manage` |
| DELETE | `/roles/:id/permissions` | `roles:manage` |
| GET | `/permissions` | `roles:manage` |

### Health

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/health` | Public |

## Environment

See `.env.example`. Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens (required in production) |
| `JWT_EXPIRES_IN` | Token lifetime (default `24h`) |
| `RESEND_API_KEY` | Resend API key for password-reset emails |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `APP_URL` | Frontend base URL for reset links |
| `RBAC_ENFORCE` | `true` to enforce permission checks |
| `SEED_USER_PASSWORD` | Optional — sets passwords for seeded admin/scout users |

`TYPEORM_SYNCHRONIZE` is disabled automatically in production. Without `RESEND_API_KEY`, reset links are logged to the server console in development.