import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';

export interface CreateUserWithPasswordInput {
  email: string;
  firstName: string;
  passwordHash: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { email: 'ASC' },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async createWithPassword(input: CreateUserWithPasswordInput): Promise<User> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.userRepository.create({
      email: input.email.toLowerCase(),
      firstName: input.firstName,
      passwordHash: input.passwordHash,
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.findByIdOrFail(userId);
    await this.userRepository.update(userId, { passwordHash });
  }

  async updateLastLoginAt(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
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