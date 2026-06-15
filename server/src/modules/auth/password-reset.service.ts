import { createHash, randomBytes } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { User } from '../user-management/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailService } from './email/email.service';

const FORGOT_PASSWORD_MESSAGE =
  'If an account exists, a reset link has been sent.';
const RESET_PASSWORD_INVALID_MESSAGE =
  'Invalid or expired password reset token';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly tokenRepository: Repository<PasswordResetToken>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async requestReset(user: User): Promise<{ message: string }> {
    await this.invalidateUnusedTokens(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresMinutes = this.configService.get<number>(
      'passwordResetExpiresMinutes',
    )!;
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    await this.tokenRepository.save(
      this.tokenRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      }),
    );

    const appUrl = this.configService.get<string>('appUrl')!;
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    try {
      await this.emailService.sendPasswordResetEmail({
        to: user.email,
        firstName: user.firstName ?? 'there',
        resetUrl,
        expiresMinutes,
      });
    } catch {
      // Do not reveal whether email delivery failed
    }

    return { message: FORGOT_PASSWORD_MESSAGE };
  }

  getForgotPasswordMessage(): { message: string } {
    return { message: FORGOT_PASSWORD_MESSAGE };
  }

  async consumeToken(rawToken: string): Promise<string> {
    const tokenHash = this.hashToken(rawToken);
    const now = new Date();

    const record = await this.tokenRepository.findOne({
      where: {
        tokenHash,
        usedAt: IsNull(),
        expiresAt: MoreThan(now),
      },
    });

    if (!record) {
      throw new BadRequestException(RESET_PASSWORD_INVALID_MESSAGE);
    }

    record.usedAt = now;
    await this.tokenRepository.save(record);

    return record.userId;
  }

  private async invalidateUnusedTokens(userId: string): Promise<void> {
    await this.tokenRepository.update(
      { userId, usedAt: IsNull() },
      { usedAt: new Date() },
    );
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}