import { Module } from '@nestjs/common';
import { MarketIntelligenceController } from './market-intelligence.controller';
import { MarketIntelligenceService } from './market-intelligence.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MarketIntelligenceController],
  providers: [MarketIntelligenceService],
  exports: [MarketIntelligenceService],
})
export class MarketIntelligenceModule {}
