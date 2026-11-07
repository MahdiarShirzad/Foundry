import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });

  app.set('trust proxy', 1);

  app.enableCors({
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(Number(process.env.PORT) || 8000);
}

void bootstrap();
