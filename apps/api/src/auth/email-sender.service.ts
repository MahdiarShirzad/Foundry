import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);
  private readonly resend: Resend | null;
  private readonly from = 'OpsDesk <onboarding@resend.dev>';

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set, email sending will be disabled');
      this.resend = null;
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendVerificationCode(email: string, code: string) {
    if (!this.resend) {
      this.logger.warn(`Email sending disabled - verification code for ${email}: ${code}`);
      return;
    }
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Your OpsDesk verification code',
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>Expires in 10 minutes.</p>`,
    });

    if (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
    }
  }

  async sendPasswordResetLink(email: string, link: string) {
    if (!this.resend) {
      this.logger.warn(`Email sending disabled - password reset link for ${email}: ${link}`);
      return;
    }
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Reset your OpsDesk password',
      html: `<p><a href="${link}">Click here to reset your password</a></p><p>Expires in 30 minutes.</p>`,
    });

    if (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error,
      );
    }
  }
}
