import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.5-flash-lite';

@Injectable()
export class AiService {
  private readonly client: GoogleGenerativeAI | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.client = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  }

  async generate(prompt: string): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const model = this.client.getGenerativeModel({ model: MODEL });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch {
      throw new InternalServerErrorException('AI generation failed');
    }
  }
}
