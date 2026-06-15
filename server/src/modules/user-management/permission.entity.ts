import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { RolePermission } from './role-permission.entity';

@Auditable()
@Entity('permissions')
@Index(['code'], { unique: true })
export class Permission extends BaseEntity {
  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];
}