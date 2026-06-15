import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from './rbac.service';
import { UserService } from './user.service';

const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const ROLE_ID = '550e8400-e29b-41d4-a716-446655440001';
const PERMISSION_ID_1 = '550e8400-e29b-41d4-a716-446655440002';
const PERMISSION_ID_2 = '550e8400-e29b-41d4-a716-446655440003';

describe('RbacService', () => {
  let rbacService: RbacService;
  let userService: jest.Mocked<Pick<UserService, 'getRoles'>>;

  beforeEach(async () => {
    userService = {
      getRoles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    rbacService = module.get(RbacService);
  });

  it('returns distinct permission codes across roles', async () => {
    userService.getRoles.mockResolvedValue([
      {
        id: ROLE_ID,
        createdById: null,
        name: 'scout',
        description: null,
        isSystem: true,
        userRoles: [],
        rolePermissions: [
          {
            id: '550e8400-e29b-41d4-a716-446655440010',
            createdById: null,
            roleId: ROLE_ID,
            permissionId: PERMISSION_ID_1,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {} as never,
            permission: {
              id: PERMISSION_ID_1,
              createdById: null,
              code: 'players:read',
              description: null,
              rolePermissions: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440011',
            createdById: null,
            roleId: ROLE_ID,
            permissionId: PERMISSION_ID_2,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {} as never,
            permission: {
              id: PERMISSION_ID_2,
              createdById: null,
              code: 'heatmap:read',
              description: null,
              rolePermissions: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      rbacService.getEffectivePermissionCodes(USER_ID),
    ).resolves.toEqual(['heatmap:read', 'players:read']);
  });

  it('checks a single permission', async () => {
    userService.getRoles.mockResolvedValue([
      {
        id: ROLE_ID,
        createdById: null,
        name: 'scout',
        description: null,
        isSystem: true,
        userRoles: [],
        rolePermissions: [
          {
            id: '550e8400-e29b-41d4-a716-446655440010',
            createdById: null,
            roleId: ROLE_ID,
            permissionId: PERMISSION_ID_1,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {} as never,
            permission: {
              id: PERMISSION_ID_1,
              createdById: null,
              code: 'heatmap:read',
              description: null,
              rolePermissions: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      rbacService.userHasPermission(USER_ID, 'heatmap:read'),
    ).resolves.toBe(true);
    await expect(
      rbacService.userHasPermission(USER_ID, 'users:manage'),
    ).resolves.toBe(false);
  });

  it('checks any permission from a list', async () => {
    userService.getRoles.mockResolvedValue([
      {
        id: ROLE_ID,
        createdById: null,
        name: 'scout',
        description: null,
        isSystem: true,
        userRoles: [],
        rolePermissions: [
          {
            id: '550e8400-e29b-41d4-a716-446655440010',
            createdById: null,
            roleId: ROLE_ID,
            permissionId: PERMISSION_ID_1,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {} as never,
            permission: {
              id: PERMISSION_ID_1,
              createdById: null,
              code: 'players:read',
              description: null,
              rolePermissions: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      rbacService.userHasAnyPermission(USER_ID, ['users:manage', 'players:read']),
    ).resolves.toBe(true);
    await expect(
      rbacService.userHasAnyPermission(USER_ID, ['users:manage', 'roles:manage']),
    ).resolves.toBe(false);
  });
});