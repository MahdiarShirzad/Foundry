import { Module } from '@nestjs/common';
import { MvpController } from './mvp.controller';
import { MvpService } from './mvp.service';

@Module({
  controllers: [MvpController],
  providers: [MvpService],
})
export class MvpModule {}
