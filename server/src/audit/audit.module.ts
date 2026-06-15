import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntitySubscriber } from '../common/subscribers/base-entity.subscriber';
import { AuditLog } from './audit-log.entity';
import { AuditService } from './audit.service';
import { AuditSubscriber } from './audit.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditSubscriber, BaseEntitySubscriber],
  exports: [AuditService],
})
export class AuditModule {}