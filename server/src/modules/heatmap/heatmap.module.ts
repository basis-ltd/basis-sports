import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEvent } from '../match-event/match-event.entity';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { HeatmapController } from './heatmap.controller';
import { HeatmapService } from './heatmap.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEvent, Player, Match])],
  controllers: [HeatmapController],
  providers: [HeatmapService],
  exports: [HeatmapService],
})
export class HeatmapModule {}