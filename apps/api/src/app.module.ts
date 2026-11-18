import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { GlobalAuthGuard } from './auth/global-auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProductModule } from './product/product.module';
import { IdeaModule } from './ideas/ideas.module';
import { MarketIntelligenceModule } from './market-intelligence/ market-intelligence.module';
import { ValidationModule } from './validation/validation.module';
import { AiModule } from './ai/ai.module';
import { MvpModule } from './mvp/mvp.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { LaunchModule } from './launch/launch.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ConfigModule.forRoot({ isGlobal: true }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
    HealthModule,
    PrismaModule,
    AiModule,
    AuthModule,
    WorkspaceModule,
    ProductModule,
    IdeaModule,
    MarketIntelligenceModule,
    ValidationModule,
    MvpModule,
    RoadmapModule,
    LaunchModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: GlobalAuthGuard },
    AppService,
  ],
})
export class AppModule {}
