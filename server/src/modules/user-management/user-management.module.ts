import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { RbacService } from './rbac.service';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
    ]),
  ],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    RbacService,
  ],
  exports: [UserService, RoleService, PermissionService, RbacService],
})
export class UserManagementModule {}