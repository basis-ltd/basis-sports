import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class RbacService {
  constructor(private readonly userService: UserService) {}

  async getEffectivePermissionCodes(userId: string): Promise<string[]> {
    const roles = await this.userService.getRoles(userId);
    const codes = new Set<string>();

    for (const role of roles) {
      for (const rolePermission of role.rolePermissions ?? []) {
        if (rolePermission.permission?.code) {
          codes.add(rolePermission.permission.code);
        }
      }
    }

    return [...codes].sort();
  }

  async userHasPermission(userId: string, code: string): Promise<boolean> {
    const codes = await this.getEffectivePermissionCodes(userId);
    return codes.includes(code);
  }

  async userHasAnyPermission(userId: string, codes: string[]): Promise<boolean> {
    if (codes.length === 0) {
      return false;
    }

    const effectiveCodes = await this.getEffectivePermissionCodes(userId);
    const effectiveSet = new Set(effectiveCodes);
    return codes.some((code) => effectiveSet.has(code));
  }
}