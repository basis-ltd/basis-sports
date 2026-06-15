const SENSITIVE_FIELDS = new Set(['passwordHash']);

export function sanitizeEntity(entity: object): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entity)) {
    if (SENSITIVE_FIELDS.has(key)) {
      continue;
    }
    if (typeof value === 'function') {
      continue;
    }

    if (value instanceof Date) {
      sanitized[key] = value.toISOString();
      continue;
    }

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      continue;
    }

    if (value !== undefined) {
      sanitized[key] = value as unknown;
    }
  }

  return sanitized;
}