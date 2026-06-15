import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerMatchStat } from './player-match-stat.entity';
import { PlayerMatchStatService } from './player-match-stat.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerMatchStat])],
  providers: [PlayerMatchStatService],
  exports: [PlayerMatchStatService],
})
export class PlayerMatchStatModule {}