import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { isAuditableEntity } from '../common/decorators/auditable.decorator';
import { AuditAction } from '../common/enums';
import { sanitizeEntity } from '../common/utils/sanitize-entity';
import { AuditLog } from './audit-log.entity';
import { AuditService } from './audit.service';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {
    dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<object>): void {
    void this.handleMutation(event, AuditAction.CREATE, null, event.entity);
  }

  afterUpdate(event: UpdateEvent<object>): void {
    if (!event.entity) {
      return;
    }

    void this.handleMutation(
      event,
      AuditAction.UPDATE,
      event.databaseEntity,
      event.entity,
    );
  }

  beforeRemove(event: RemoveEvent<object>): void {
    void this.handleMutation(event, AuditAction.DELETE, event.entity, null);
  }

  private async handleMutation(
    event: InsertEvent<object> | UpdateEvent<object> | RemoveEvent<object>,
    action: AuditAction,
    oldEntity: object | null | undefined,
    newEntity: object | null | undefined,
  ): Promise<void> {
    if (!event.metadata.target) {
      return;
    }

    if (event.metadata.target === AuditLog) {
      return;
    }

    const entityInstance = newEntity ?? oldEntity;
    if (!entityInstance || !isAuditableEntity(entityInstance)) {
      return;
    }

    const entityId = this.extractEntityId(entityInstance);
    if (entityId === null) {
      return;
    }

    const entityName =
      typeof event.metadata.target === 'function'
        ? event.metadata.target.name
        : event.metadata.target;

    await this.auditService.logChange(
      action,
      entityName,
      entityId,
      oldEntity ? sanitizeEntity(oldEntity) : null,
      newEntity ? sanitizeEntity(newEntity) : null,
    );
  }

  private extractEntityId(entity: object): number | null {
    const id = (entity as { id?: unknown }).id;
    return typeof id === 'number' ? id : null;
  }

}