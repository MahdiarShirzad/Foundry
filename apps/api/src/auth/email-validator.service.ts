import { Injectable } from '@nestjs/common';
import { promises as dns } from 'node:dns';

@Injectable()
export class EmailValidatorService {
  async hasMxRecord(email: string): Promise<boolean> {
    const domain = email.split('@')[1];

    if (!domain) {
      return false;
    }

    try {
      const records = await dns.resolveMx(domain);
      return records.length > 0;
    } catch (error) {
      return false;
    }
  }
}
