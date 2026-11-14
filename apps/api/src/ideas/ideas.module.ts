import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IdeaController } from './ideas.controller';
import { IdeaService } from './ideas.service';

@Module({
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [IdeaService],
})
export class IdeaModule {}
