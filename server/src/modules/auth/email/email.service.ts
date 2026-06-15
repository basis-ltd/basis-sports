import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { buildPasswordResetEmail } from './templates/password-reset.template';
import { buildWelcomeEmail } from './templates/welcome.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('resend.apiKey');
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  async sendPasswordResetEmail(params: {
    to: string;
    firstName: string;
    resetUrl: string;
    expiresMinutes: number;
  }): Promise<void> {
    const { subject, html, text } = buildPasswordResetEmail({
      firstName: params.firstName,
      resetUrl: params.resetUrl,
      expiresMinutes: params.expiresMinutes,
    });

    await this.send({
      to: params.to,
      subject,
      html,
      text,
      idempotencyKey: `password-reset:${params.to}:${params.resetUrl.slice(-16)}`,
      devLogLabel: 'Password reset link',
      devLogUrl: params.resetUrl,
    });
  }

  async sendWelcomeEmail(params: {
    to: string;
    firstName: string;
  }): Promise<void> {
    const appUrl = this.configService.get<string>('appUrl')!;
    const { subject, html, text } = buildWelcomeEmail({
      firstName: params.firstName,
      appUrl,
    });

    await this.send({
      to: params.to,
      subject,
      html,
      text,
      idempotencyKey: `welcome:${params.to}`,
    });
  }

  private async send(options: {
    to: string;
    subject: string;
    html: string;
    text: string;
    idempotencyKey: string;
    devLogLabel?: string;
    devLogUrl?: string;
  }): Promise<void> {
    const from = this.configService.get<string>('resend.fromEmail')!;

    if (!this.resend) {
      if (options.devLogUrl) {
        this.logger.warn(
          `${options.devLogLabel ?? 'Email'} (RESEND_API_KEY not set): ${options.devLogUrl}`,
        );
      } else {
        this.logger.warn(
          `Email not sent (RESEND_API_KEY not set): ${options.subject} -> ${options.to}`,
        );
      }
      return;
    }

    const { error } = await this.resend.emails.send(
      {
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        tags: [{ name: 'app', value: 'basis_sports' }],
      },
      { idempotencyKey: options.idempotencyKey },
    );

    if (error) {
      this.logger.error(`Resend error: ${error.message}`);
      throw new Error('Failed to send email');
    }
  }
}