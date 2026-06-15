import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getAuditContext } from '../common/audit-context.storage';
import { AuditAction } from '../common/enums';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logChange(
    action: AuditAction,
    entityName: string,
    entityId: number,
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const context = getAuditContext();

    const auditLog = this.auditLogRepository.create({
      action,
      entityName,
      entityId,
      oldValue: oldValue ?? undefined,
      newValue: newValue ?? undefined,
      metadata: {
        ...context,
        ...metadata,
      },
    });

    await this.auditLogRepository.save(auditLog);
  }
}