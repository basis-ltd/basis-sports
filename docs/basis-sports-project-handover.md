# basis-sports — Football Analytics Platform
## Comprehensive Project Handover Document for Implementation

**Project Vision**  
This project builds a professional **football (soccer) analytics platform** focused on **player scouting**. It provides rich tournament/season/match/player data (inspired by Livescore) combined with powerful, filterable scouting reports.  

**Phase 1 Goal (MVP)**: Deliver interactive **player heatmaps** (zone-based grid) using FIFA World Cup 2026 data, with full audit trail from day one. The platform enables scouts to quickly analyze player positioning and activity across matches, seasons, and tournaments.

**Current Time Context**: June 2026 — perfect timing for FIFA World Cup 2026 (June 11 – July 19, 2026, 48 teams, 12 groups, 104 matches).

---

## 1. Finalized Tech Stack

### Backend
- **Framework**: NestJS (TypeScript, modular, scalable)
- **ORM**: TypeORM + PostgreSQL
- **Validation & Docs**: `class-validator`, `class-transformer`, `@nestjs/swagger`
- **State & API Layer on Frontend**: RTK Query (from `@reduxjs/toolkit/query`)
- **Audit Trail**: Custom full audit module (inspired by professional patterns — see section 5)
- **Other**: `dotenv`, `helmet` (security), `compression`

### Frontend
- **Core**: Vite + React + TypeScript
- **Styling & UI**: Tailwind CSS + shadcn/ui (beautiful, accessible components)
- **State Management**: Redux Toolkit (slices + **RTK Query** for server state)
- **Routing**: `react-router-dom`
- **Visualizations**:
  - `draw-football-pitch-library` (React SVG football pitch component)
  - Canvas or SVG overlays for zone-based heatmaps
  - `recharts` (for future radar charts, standings, etc.)
- **Utilities**: `date-fns`, `lucide-react` (icons), `html2canvas` (export reports)

### Mono-repo & Tooling
- **Structure**: pnpm workspaces (recommended for speed)
- **Root scripts**: `dev:api`, `dev:web`, `seed`, `build`, `lint`
- **No Docker** (local Postgres assumed or connection string)
- **Shared**: `packages/shared` for TypeScript types, constants, and Zod schemas (future validation)

### Audit Trail (Mandatory from Day 1)
Full change logging on all mutable entities (CREATE / UPDATE / DELETE). See dedicated section below.

---

## 2. Mono-repo Structure (`basis-sports`)

```bash
basis-sports/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── audit/                # ← Full audit module (core)
│   │   │   │   ├── audit-log.entity.ts
│   │   │   │   ├── audit.subscriber.ts
│   │   │   │   ├── audit.service.ts
│   │   │   │   └── audit.module.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   └── interceptors/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   │   └── data-source.ts
│   │   │   ├── modules/
│   │   │   │   ├── tournament/
│   │   │   │   ├── season/
│   │   │   │   ├── team/
│   │   │   │   ├── player/
│   │   │   │   ├── match/
│   │   │   │   ├── match-event/
│   │   │   │   ├── player-match-stat/
│   │   │   │   └── heatmap/          # Phase 1 feature module
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Vite React Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   └── providers.tsx     # Redux + RTK Query + Router
│       │   ├── components/
│       │   │   ├── ui/               # shadcn components
│       │   │   ├── shared/
│       │   │   │   ├── FiltersBar.tsx
│       │   │   │   └── PitchHeatmap.tsx   # Core Phase 1 component
│       │   │   └── reports/
│       │   ├── features/
│       │   │   ├── heatmap/
│       │   │   │   ├── HeatmapReport.tsx
│       │   │   │   └── heatmapApi.ts   # RTK Query endpoints
│       │   │   └── players/
│       │   ├── store/
│       │   │   ├── store.ts
│       │   │   └── slices/
│       │   ├── lib/
│       │   │   └── utils.ts
│       │   ├── routes/
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   └── shared/                       # Shared TS types, enums, constants
│       ├── src/
│       │   ├── types/
│       │   │   ├── entities.ts
│       │   │   └── api.ts
│       │   ├── constants/
│       │   │   └── football.ts       # Positions, event types, pitch zones
│       │   └── index.ts
│       └── package.json
│
├── .env.example
├── pnpm-workspace.yaml
├── package.json                      # Root with workspaces + scripts
├── tsconfig.base.json
├── README.md
└── docs/
    └── ERD.md                        # Visual diagrams
```

**Recommended pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 3. Database Schema & ER Diagram

### Core Entities (Phase 1)

**Tournament** → **Season** → **Match**  
**Team** participates in matches  
**Player** generates **MatchEvent** (for heatmaps) and has **PlayerMatchStat**

### Full ER Diagram (Mermaid — copy to mermaid.live)

```mermaid
erDiagram
    TOURNAMENT ||--o{ SEASON : has
    SEASON ||--o{ MATCH : contains
    TEAM ||--o{ MATCH : "home"
    TEAM ||--o{ MATCH : "away"
    TEAM ||--o{ PLAYER : "current club (optional)"
    PLAYER ||--o{ MATCH_EVENT : generates
    MATCH ||--o{ MATCH_EVENT : has
    PLAYER ||--o{ PLAYER_MATCH_STAT : "stats in"
    MATCH ||--o{ PLAYER_MATCH_STAT : "stats for"
    AUDIT_LOG ||--o{ AUDIT_LOG : "logs changes to all auditable entities"

    TOURNAMENT {
        int id PK
        string name "FIFA World Cup 2026"
        string type "cup"
        string country "International"
        string logo_url
        jsonb metadata
    }

    SEASON {
        int id PK
        int tournament_id FK
        string name "2026"
        date start_date "2026-06-11"
        date end_date "2026-07-19"
        string status "ongoing"
    }

    TEAM {
        int id PK
        string name
        string short_name
        string logo_url
        string country
        string confederation "UEFA|CONMEBOL|etc"
        int group_id
    }

    PLAYER {
        int id PK
        string name
        string position "GK|CB|LB|RB|CDM|CM|CAM|LW|RW|ST"
        string nationality
        date birth_date
        int height_cm
        int weight_kg
        string preferred_foot
        string photo_url
        int current_team_id FK
    }

    MATCH {
        int id PK
        int season_id FK
        int home_team_id FK
        int away_team_id FK
        timestamp match_date
        string status "finished"
        int home_score
        int away_score
        string venue
        string stage "group|round_of_16|etc"
        int group_number
    }

    MATCH_EVENT {
        int id PK
        int match_id FK
        int player_id FK
        int team_id FK
        string event_type "pass|shot|dribble|tackle|interception|goal|clearance"
        int minute
        float x "0-100 (left to right)"
        float y "0-100 (bottom to top)"
        float end_x
        float end_y
        string outcome "success|fail"
        string period "1H|2H"
    }

    PLAYER_MATCH_STAT {
        int id PK
        int match_id FK
        int player_id FK
        int team_id FK
        int minutes_played
        int goals
        int assists
        int yellow_cards
        int red_cards
        int shots
        int passes_completed
        float distance_covered_m
        float xg
    }

    AUDIT_LOG {
        int id PK
        timestamp created_at
        string action "CREATE|UPDATE|DELETE"
        string entity_name
        int entity_id
        int user_id nullable
        jsonb old_value
        jsonb new_value
        jsonb metadata "ip, userAgent, requestId, etc."
    }
```

### Pitch Coordinate System (Standard)
- `x`: 0 (left goal / defensive for home) → 100 (right goal)
- `y`: 0 (bottom sideline) → 100 (top sideline)
- Events are stored with these normalized values for easy zone calculations.

---

## 4. Full Audit Trail System (From Day One)

**Requirement**: Every create/update/delete on auditable entities must be logged automatically with before/after state.

### Design (Production-Ready Pattern)

**AuditLog Entity** (`apps/api/src/audit/audit-log.entity.ts`)
```ts
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: ['CREATE', 'UPDATE', 'DELETE'] })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column()
  entityName: string;

  @Column()
  entityId: number;

  @Column({ nullable: true })
  userId: number;           // nullable for presentation mode / system actions

  @Column({ type: 'jsonb', nullable: true })
  oldValue: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValue: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;   // { ip, userAgent, endpoint, requestId }
}
```

**Implementation Approach** (choose one or hybrid):

1. **TypeORM Subscriber** (recommended for automatic):
   - `AuditSubscriber` implements `EntitySubscriberInterface`
   - Listens to `beforeInsert`, `beforeUpdate`, `beforeRemove`
   - Compares old vs new using `entityManager`
   - Inserts into `audit_logs`

2. **Decorator** (optional nice-to-have):
   ```ts
   @Auditable()
   export class MatchEvent {}
   ```

3. **HTTP Interceptor** (for context):
   - Captures `req.ip`, `req.headers['user-agent']`, current user (when auth added later)
   - Attaches to `Request` context via `AsyncLocalStorage` or Nest request scope

**Presentation Mode Handling**:
- `userId` defaults to `null` or a seeded `demo-scout` user.
- All seed scripts should also trigger audit logs (or mark as `system`).

**Why from Day 1?**  
- Compliance & debugging
- Future multi-user support (scouts, analysts)
- Easy to extend with retention policies or export

---

## 5. Seeding Strategy — FIFA World Cup 2026

**Tournament**: "FIFA World Cup 2026" (type: `cup`)  
**Season**: "2026" (June 11 – July 19)

**Data Volume for Phase 1 (realistic but manageable)**:
- 12 Groups × 4 teams = **48 teams**
- **~150–200 players** (4–6 key players per team with full profiles + positions)
- **12–20 sample matches** (focus on group stage + 2–3 knockout for demo)
- **MatchEvents**: 80–250 events per demo player across their matches (clustered realistically by position)
  - Example: Lionel Messi (Argentina) → high activity in attacking third, right half-space
  - Centre-backs → clustered in defensive third

**Zone Definition for Heatmap (Zone-based Grid)**:
Define 12–18 logical zones in `packages/shared/src/constants/football.ts`:
- Defensive Third / Middle Third / Attacking Third
- Left / Center / Right channels
- Example zones: `DEF_LEFT`, `MID_CENTER`, `ATT_RIGHT`, etc.

**Seed Script** (`apps/api/src/database/seed.ts` or Nest command):
- Uses TypeORM `DataSource`
- Creates tournament → season
- Creates all 48 teams + groups
- Creates players with realistic names/positions/nationalities
- Creates matches with dates, venues (use real 2026 host cities where possible)
- Generates `MatchEvent` records with position clustering logic (simple random within position-specific bounding boxes)
- Also creates `PlayerMatchStat` summaries

**Seed Command**: `pnpm seed` or `nest run seed`

---

## 6. Phase 1 Detailed Implementation Plan

### Backend Tasks
1. **Project Bootstrap & Mono-repo**
   - Initialize pnpm workspaces, root `package.json`, shared package
   - Create `apps/api` with NestJS + TypeORM + Postgres connection
   - Add audit module first (entity + subscriber + service)

2. **Core Modules** (generate with `nest g module`)
   - tournament, season, team, player, match, match-event, player-match-stat
   - All entities with proper relations + indexes (especially on `match_event.player_id`, `match_event.match_id`, `x`, `y`)

3. **Heatmap Module**
   - DTOs with validation (`GetHeatmapQueryDto`)
   - Service that:
     - Accepts filters (playerId, seasonId, matchIds[], eventTypes?)
     - Queries `MatchEvent` with TypeORM query builder
     - Calculates zone counts using shared zone definitions
     - Returns:
       ```ts
       {
         zones: Array<{ id: string; label: string; count: number; intensity: number; x1,x2,y1,y2 }>,
         totalActions: number,
         centroid: { x: number; y: number },
         player: { id, name, position },
         filters: {...}
       }
       ```
   - Controller with Swagger docs

4. **Audit Integration**
   - Make all core entities auditable via subscriber
   - Test that creating a match event logs to `audit_logs`

### Frontend Tasks
1. **Setup + Providers**
   - Redux store with RTK Query api slice
   - shadcn/ui installation + theme (green pitch-inspired)

2. **Filters Component** (reusable)
   - Cascading: Tournament → Season → Player (searchable) → Matches (multi-select)
   - Use RTK Query hooks

3. **PitchHeatmap Component** (core deliverable)
   - Uses `draw-football-pitch-library` for base pitch
   - Overlays colored rectangles (or canvas) for each zone
   - Color scale: cool (low) → warm (high intensity)
   - Tooltip on zone hover: "Zone: Attacking Right | Touches: 47 (34%)"
   - Summary cards below pitch: Total actions, Avg position, % in final third

4. **HeatmapReport Page**
   - Top filters bar
   - Main pitch visualization
   - Export button (PNG of report section using html2canvas)
   - Loading & empty states

### Shared
- Define all TypeScript interfaces in `packages/shared`
- Pitch zone constants + helper functions (`getZoneForPoint(x, y)`)

### Acceptance Criteria for Phase 1
- User can select FIFA World Cup 2026 → 2026 season → a player → generate heatmap
- Zone-based visualization renders correctly on pitch with meaningful colors
- Changing filters instantly updates the heatmap (optimistic or proper loading)
- Audit logs are created for all seeded data and any manual creates/updates
- Code is clean, typed, and documented with Swagger

---

## 7. Key API Endpoints (Phase 1)

| Method | Endpoint                        | Description                          | Key Query Params                     |
|--------|---------------------------------|--------------------------------------|--------------------------------------|
| GET    | `/tournaments`                  | List tournaments                     | -                                    |
| GET    | `/seasons`                      | List seasons                         | `tournamentId`                       |
| GET    | `/players`                      | Search players                       | `search`, `position`, `teamId`       |
| GET    | `/matches`                      | List matches                         | `seasonId`, `teamId`                 |
| GET    | `/heatmap`                      | **Core** — Generate zone heatmap     | `playerId`, `seasonId`, `matchIds[]` |
| POST   | `/matches` / PUT / DELETE       | (for testing audit)                  | -                                    |

Example `/heatmap` response shape is defined in the service section above.

---

## 8. Development Workflow

**Prerequisites**
- Node.js ≥ 20
- PostgreSQL running locally (create `basis_sports_dev` database)
- pnpm installed globally

**Setup**
```bash
git clone ... basis-sports
cd basis-sports
pnpm install
cp .env.example .env
# Edit DATABASE_URL etc.
pnpm seed          # Seeds FIFA WC 2026 data + audit logs
```

**Run**
```bash
pnpm dev:api       # http://localhost:3000 (Swagger at /docs)
pnpm dev:web       # http://localhost:5173
```

**Environment Variables** (`.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/basis_sports_dev
PORT=3000
NODE_ENV=development
```

---

## 9. Roadmap After Phase 1

- **Phase 2**: Team standings, rich player profiles, radar charts, player comparison
- **Phase 3**: Authentication (JWT + roles), saved reports, user-specific filters
- **Phase 4**: Real data ingestion pipeline (StatsBomb open data, API-Football, etc.)
- **Phase 5**: Advanced analytics (xG, pass networks, similarity scoring)

---

## 10. Open Questions & Next Steps

1. Confirm exact zone count and labeling (12 vs 18 zones?) — I recommend starting with **12 zones** for clarity.
2. Preferred color scale for heatmap intensity? (Green→Red or Blue→Yellow classic scouting style)
3. Any specific demo players or matches you want highlighted in the seed data?
4. Shall we add a simple "Player Profile" page in Phase 1 as a bonus (shows basic info + link to heatmap)?
5. Do you want the audit subscriber to also log **reads** (for compliance) or only mutations?

---

**This document is ready for implementation.**  
You can now start building the mono-repo structure, audit module, entities, and the heatmap feature end-to-end.

**Next action for Grok Build / team**: Begin with Task 1 (Bootstrap + Audit module) and report back when the first seed + basic `/heatmap` endpoint is working.

Let's build an outstanding football scouting platform! ⚽📈

---
*Document generated for basis-sports • June 2026*