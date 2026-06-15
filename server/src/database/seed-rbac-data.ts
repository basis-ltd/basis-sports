export const RBAC_SEED_METADATA = {
  source: 'system',
  seed: true,
  requestId: 'rbac-seed',
} as const;

export const SEED_PERMISSIONS = [
  { code: 'tournaments:read', description: 'List tournaments' },
  { code: 'tournaments:manage', description: 'Create, update, and delete tournaments' },
  { code: 'seasons:read', description: 'List seasons' },
  { code: 'seasons:manage', description: 'Create, update, and delete seasons' },
  { code: 'teams:read', description: 'List teams' },
  { code: 'teams:manage', description: 'Create, update, and delete teams' },
  { code: 'players:read', description: 'Search and list players' },
  { code: 'players:manage', description: 'Create, update, and delete players' },
  { code: 'matches:read', description: 'List matches' },
  { code: 'matches:manage', description: 'Create, update, and delete matches' },
  { code: 'match-events:read', description: 'List match events' },
  { code: 'match-events:manage', description: 'Create, update, and delete match events' },
  {
    code: 'player-match-stats:read',
    description: 'List player match statistics',
  },
  {
    code: 'player-match-stats:manage',
    description: 'Create, update, and delete player match statistics',
  },
  { code: 'heatmap:read', description: 'Generate heatmap reports' },
  { code: 'users:manage', description: 'Manage users and role assignments' },
  { code: 'roles:manage', description: 'Manage roles and permission assignments' },
] as const;

const READ_PERMISSIONS = SEED_PERMISSIONS.filter((p) =>
  p.code.endsWith(':read'),
).map((p) => p.code);

export const SEED_ROLES = {
  admin: {
    name: 'admin',
    description: 'Platform administrator with full access',
    isSystem: true,
    permissions: SEED_PERMISSIONS.map((p) => p.code),
  },
  scout: {
    name: 'scout',
    description: 'Read-only scouting access',
    isSystem: true,
    permissions: READ_PERMISSIONS,
  },
} as const;

export const SEED_USERS = [
  {
    email: 'admin@basis-sports.local',
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
  },
  {
    email: 'scout@basis-sports.local',
    firstName: 'Demo',
    lastName: 'Scout',
    role: 'scout',
  },
] as const;