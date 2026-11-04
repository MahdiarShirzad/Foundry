import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.enableCors({
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8000);
}
void bootstrap();
