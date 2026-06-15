import { AsyncLocalStorage } from 'async_hooks';

export interface AuditContext {
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

export const auditContextStorage = new AsyncLocalStorage<AuditContext>();

export function getAuditContext(): AuditContext {
  return auditContextStorage.getStore() ?? {};
}