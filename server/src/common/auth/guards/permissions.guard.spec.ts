import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../../../modules/user-management/rbac.service';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '../auth.constants';
import { PermissionsGuard } from './permissions.guard';

const USER_ID = '550e8400-e29b-41d4-a716-446655440000';

function createContext(user?: { id: string; email: string }): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;
  let rbacService: jest.Mocked<Pick<RbacService, 'userHasAnyPermission'>>;
  let configService: jest.Mocked<Pick<ConfigService, 'get'>>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    rbacService = {
      userHasAnyPermission: jest.fn(),
    };
    configService = {
      get: jest.fn(),
    };

    guard = new PermissionsGuard(
      reflector as unknown as Reflector,
      rbacService as unknown as RbacService,
      configService as unknown as ConfigService,
    );
  });

  it('allows public routes', async () => {
    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) {
        return true;
      }
      return undefined;
    });

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(rbacService.userHasAnyPermission).not.toHaveBeenCalled();
  });

  it('allows protected routes when RBAC enforcement is disabled', async () => {
    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === PERMISSIONS_KEY) {
        return ['matches:read'];
      }
      return undefined;
    });
    configService.get.mockReturnValue(false);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(rbacService.userHasAnyPermission).not.toHaveBeenCalled();
  });

  it('requires authentication when enforcement is enabled', async () => {
    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === PERMISSIONS_KEY) {
        return ['matches:read'];
      }
      return undefined;
    });
    configService.get.mockReturnValue(true);

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('denies access when enforcement is enabled and permission is missing', async () => {
    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === PERMISSIONS_KEY) {
        return ['matches:manage'];
      }
      return undefined;
    });
    configService.get.mockReturnValue(true);
    rbacService.userHasAnyPermission.mockResolvedValue(false);

    await expect(
      guard.canActivate(
        createContext({ id: USER_ID, email: 'user@example.com' }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows access when enforcement is enabled and permission is granted', async () => {
    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === PERMISSIONS_KEY) {
        return ['matches:manage'];
      }
      return undefined;
    });
    configService.get.mockReturnValue(true);
    rbacService.userHasAnyPermission.mockResolvedValue(true);

    await expect(
      guard.canActivate(
        createContext({ id: USER_ID, email: 'user@example.com' }),
      ),
    ).resolves.toBe(true);
    expect(rbacService.userHasAnyPermission).toHaveBeenCalledWith(USER_ID, [
      'matches:manage',
    ]);
  });
});