import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEventController } from './match-event.controller';
import { MatchEvent } from './match-event.entity';
import { MatchEventService } from './match-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEvent])],
  controllers: [MatchEventController],
  providers: [MatchEventService],
  exports: [MatchEventService],
})
export class MatchEventModule {}