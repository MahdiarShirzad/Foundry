import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  async sendVerificationCode(email: string, code: string) {
    this.logger.log(`[Dev] verification code for ${email} ${code}`);
  }

  async sendPasswordResetLink(email: string, link: string) {
    this.logger.log(`[Dev] password reset link for ${email} ${link}`);
  }
}
