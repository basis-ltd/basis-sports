export const RBAC_SEED_METADATA = {
  source: 'system',
  seed: true,
  requestId: 'rbac-seed',
} as const;

export const SEED_PERMISSIONS = [
  { code: 'tournaments:read', description: 'List tournaments' },
  { code: 'seasons:read', description: 'List seasons' },
  { code: 'players:read', description: 'Search and list players' },
  { code: 'matches:read', description: 'List matches' },
  { code: 'heatmap:read', description: 'Generate heatmap reports' },
  { code: 'users:manage', description: 'Manage users and role assignments' },
  { code: 'roles:manage', description: 'Manage roles and permission assignments' },
] as const;

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
    permissions: [
      'tournaments:read',
      'seasons:read',
      'players:read',
      'matches:read',
      'heatmap:read',
    ],
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