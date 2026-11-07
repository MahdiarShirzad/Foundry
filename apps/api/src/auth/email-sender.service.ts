import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);
  private readonly resend: Resend;
  private readonly from = 'OpsDesk <onboarding@resend.dev>';

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async sendVerificationCode(email: string, code: string) {
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
