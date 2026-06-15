import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ order: { code: 'ASC' } });
  }

  findByCode(code: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({ where: { code } });
  }

  findByCodes(codes: string[]): Promise<Permission[]> {
    if (codes.length === 0) {
      return Promise.resolve([]);
    }

    return this.permissionRepository.find({
      where: { code: In(codes) },
      order: { code: 'ASC' },
    });
  }
}