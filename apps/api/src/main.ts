import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module';
import { Response, Request } from 'express';
import { ValidationPipe } from '@nestjs/common';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Foundry API')
    .setDescription('Official API documentation for Foundry.')
    .setVersion(process.env.npm_package_version || '0.0.1')
    .addServer('http://localhost:8000', 'Development')
    .addServer(process.env.API_URL || 'https://api.foundry.app', 'Production')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Foundry API Docs',
  });

  app.getHttpAdapter().get('/api/docs-json', (req: any, res: any) => {
    res.json(document);
  });

  await app.listen(Number(process.env.PORT) || 8000);
}

void bootstrap();
