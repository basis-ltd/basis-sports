import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { getAuditContext } from '../audit-context.storage';
import { BaseEntity } from '../entities/base.entity';

@EventSubscriber()
export class BaseEntitySubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<BaseEntity>): void {
    const entity = event.entity;
    if (!entity) {
      return;
    }

    const hasCreatedById = event.metadata.columns.some(
      (column) => column.propertyName === 'createdById',
    );
    if (!hasCreatedById || entity.createdById) {
      return;
    }

    const { userId } = getAuditContext();
    if (userId) {
      entity.createdById = userId;
    }
  }
}