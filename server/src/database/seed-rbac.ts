import { DataSource, Repository } from 'typeorm';
import { auditContextStorage } from '../common/audit-context.storage';
import { Permission } from '../modules/user-management/permission.entity';
import { RolePermission } from '../modules/user-management/role-permission.entity';
import { Role } from '../modules/user-management/role.entity';
import { UserRole } from '../modules/user-management/user-role.entity';
import { User } from '../modules/user-management/user.entity';
import {
  RBAC_SEED_METADATA,
  SEED_PERMISSIONS,
  SEED_ROLES,
  SEED_USERS,
} from './seed-rbac-data';

async function upsertPermissions(
  permissionRepo: Repository<Permission>,
): Promise<Map<string, Permission>> {
  const permissionsByCode = new Map<string, Permission>();

  for (const seedPermission of SEED_PERMISSIONS) {
    let permission = await permissionRepo.findOne({
      where: { code: seedPermission.code },
    });

    if (!permission) {
      permission = await permissionRepo.save(
        permissionRepo.create({
          code: seedPermission.code,
          description: seedPermission.description,
        }),
      );
    } else if (permission.description !== seedPermission.description) {
      permission.description = seedPermission.description;
      permission = await permissionRepo.save(permission);
    }

    permissionsByCode.set(seedPermission.code, permission);
  }

  return permissionsByCode;
}

async function upsertRoles(
  roleRepo: Repository<Role>,
): Promise<Map<string, Role>> {
  const rolesByName = new Map<string, Role>();

  for (const seedRole of Object.values(SEED_ROLES)) {
    let role = await roleRepo.findOne({ where: { name: seedRole.name } });

    if (!role) {
      role = await roleRepo.save(
        roleRepo.create({
          name: seedRole.name,
          description: seedRole.description,
          isSystem: seedRole.isSystem,
        }),
      );
    } else {
      role.description = seedRole.description;
      role.isSystem = seedRole.isSystem;
      role = await roleRepo.save(role);
    }

    rolesByName.set(seedRole.name, role);
  }

  return rolesByName;
}

async function upsertUsers(
  userRepo: Repository<User>,
): Promise<Map<string, User>> {
  const usersByEmail = new Map<string, User>();

  for (const seedUser of SEED_USERS) {
    let user = await userRepo.findOne({ where: { email: seedUser.email } });

    if (!user) {
      user = await userRepo.save(
        userRepo.create({
          email: seedUser.email,
          firstName: seedUser.firstName,
          lastName: seedUser.lastName,
          isActive: true,
        }),
      );
    } else {
      user.firstName = seedUser.firstName;
      user.lastName = seedUser.lastName;
      user.isActive = true;
      user = await userRepo.save(user);
    }

    usersByEmail.set(seedUser.email, user);
  }

  return usersByEmail;
}

export async function seedRbac(dataSource: DataSource): Promise<void> {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);

  console.log('\nSeeding RBAC data...');

  const permissionsByCode = await upsertPermissions(permissionRepo);
  const rolesByName = await upsertRoles(roleRepo);
  const usersByEmail = await upsertUsers(userRepo);
  const adminUser = usersByEmail.get('admin@basis-sports.local')!;

  await auditContextStorage.run(
    {
      requestId: RBAC_SEED_METADATA.requestId,
      userAgent: 'basis-sports-seed-script',
      ip: '127.0.0.1',
      userId: adminUser.id,
    },
    async () => {
      for (const seedRole of Object.values(SEED_ROLES)) {
        const role = rolesByName.get(seedRole.name)!;
        const permissionIds = seedRole.permissions.map(
          (code) => permissionsByCode.get(code)!.id,
        );
        const existingAssignments = await rolePermissionRepo.find({
          where: { roleId: role.id },
        });
        const existingPermissionIds = new Set(
          existingAssignments.map((row) => row.permissionId),
        );
        const toAssign = permissionIds.filter(
          (id) => !existingPermissionIds.has(id),
        );

        if (toAssign.length > 0) {
          await rolePermissionRepo.save(
            toAssign.map((permissionId) =>
              rolePermissionRepo.create({ roleId: role.id, permissionId }),
            ),
          );
        }
      }

      for (const seedUser of SEED_USERS) {
        const user = usersByEmail.get(seedUser.email)!;
        const role = rolesByName.get(seedUser.role)!;
        const existingAssignment = await userRoleRepo.findOne({
          where: { userId: user.id, roleId: role.id },
        });

        if (!existingAssignment) {
          await userRoleRepo.save(
            userRoleRepo.create({ userId: user.id, roleId: role.id }),
          );
        }
      }
    },
  );

  console.log('RBAC seed completed successfully!');
  console.log(`  Permissions: ${permissionsByCode.size}`);
  console.log(`  Roles:       ${rolesByName.size}`);
  console.log(`  Users:       ${usersByEmail.size}`);
}