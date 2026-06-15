import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ order: { name: 'ASC' } });
  }

  findById(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: {
        rolePermissions: { permission: true },
      },
    });
  }

  findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: {
        rolePermissions: { permission: true },
      },
    });
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) {
      return;
    }

    const existing = await this.rolePermissionRepository.find({
      where: { roleId, permissionId: In(permissionIds) },
      select: { permissionId: true },
    });
    const existingIds = new Set(existing.map((row) => row.permissionId));
    const toCreate = permissionIds.filter((id) => !existingIds.has(id));

    if (toCreate.length === 0) {
      return;
    }

    await this.rolePermissionRepository.save(
      toCreate.map((permissionId) =>
        this.rolePermissionRepository.create({ roleId, permissionId }),
      ),
    );
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) {
      return;
    }

    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: In(permissionIds),
    });
  }
}