import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: {
        role: {
          rolePermissions: { permission: true },
        },
      },
    });

    return userRoles.map((userRole) => userRole.role);
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) {
      return;
    }

    const existing = await this.userRoleRepository.find({
      where: { userId, roleId: In(roleIds) },
      select: { roleId: true },
    });
    const existingIds = new Set(existing.map((row) => row.roleId));
    const toCreate = roleIds.filter((id) => !existingIds.has(id));

    if (toCreate.length === 0) {
      return;
    }

    await this.userRoleRepository.save(
      toCreate.map((roleId) =>
        this.userRoleRepository.create({ userId, roleId }),
      ),
    );
  }

  async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) {
      return;
    }

    await this.userRoleRepository.delete({
      userId,
      roleId: In(roleIds),
    });
  }
}