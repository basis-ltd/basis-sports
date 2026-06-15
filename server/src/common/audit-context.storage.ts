import { AsyncLocalStorage } from 'async_hooks';

export interface AuditContext {
  ip?: string;
  userAgent?: string;
  requestId?: string;
  method?: string;
  path?: string;
  userId?: string;
}

export const auditContextStorage = new AsyncLocalStorage<AuditContext>();

export function getAuditContext(): AuditContext {
  return auditContextStorage.getStore() ?? {};
}