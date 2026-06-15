export function sanitizeEntity(entity: object): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entity)) {
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