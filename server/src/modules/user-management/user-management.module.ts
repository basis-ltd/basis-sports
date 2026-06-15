import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { RbacService } from './rbac.service';
import { RoleController } from './role.controller';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { UserController } from './user.controller';
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
  controllers: [UserController, RoleController, PermissionController],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    RbacService,
  ],
  exports: [UserService, RoleService, PermissionService, RbacService],
})
export class UserManagementModule {}