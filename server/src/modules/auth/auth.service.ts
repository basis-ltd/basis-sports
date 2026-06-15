import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RbacService } from '../user-management/rbac.service';
import { RoleService } from '../user-management/role.service';
import { User } from '../user-management/user.entity';
import { UserService } from '../user-management/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from './email/email.service';
import { PasswordResetService } from './password-reset.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUserResponse;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly rbacService: RbacService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailService: EmailService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponse> {
    const passwordHash = await this.passwordService.hash(dto.password);

    let user: User;
    try {
      user = await this.userService.createWithPassword({
        email: dto.email,
        firstName: dto.firstName,
        passwordHash,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }

    const scoutRole = await this.roleService.findByName('scout');
    if (scoutRole) {
      await this.userService.assignRoles(user.id, [scoutRole.id]);
    }

    void this.emailService
      .sendWelcomeEmail({ to: user.email, firstName: user.firstName })
      .catch((err: Error) => {
        this.logger.warn(`Welcome email failed for ${user.email}: ${err.message}`);
      });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmailWithPassword(dto.email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.userService.updateLastLoginAt(user.id);
    user.lastLoginAt = new Date();

    return this.buildAuthResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user?.isActive) {
      return this.passwordResetService.getForgotPasswordMessage();
    }

    return this.passwordResetService.requestReset(user);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const userId = await this.passwordResetService.consumeToken(dto.token);
    const passwordHash = await this.passwordService.hash(dto.password);
    await this.userService.updatePassword(userId, passwordHash);

    return { message: 'Password has been reset successfully' };
  }

  async getProfile(userId: string): Promise<{
    user: AuthUserResponse;
    permissions: string[];
  }> {
    const user = await this.userService.findByIdOrFail(userId);
    const permissions = await this.rbacService.getEffectivePermissionCodes(
      userId,
    );

    return {
      user: this.toAuthUser(user),
      permissions,
    };
  }

  private buildAuthResponse(user: User): AuthResponse {
    return {
      accessToken: this.tokenService.signAccessToken(user.id, user.email),
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: User): AuthUserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName ?? null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}