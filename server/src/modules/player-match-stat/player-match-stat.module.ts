import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerMatchStatController } from './player-match-stat.controller';
import { PlayerMatchStat } from './player-match-stat.entity';
import { PlayerMatchStatService } from './player-match-stat.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerMatchStat])],
  controllers: [PlayerMatchStatController],
  providers: [PlayerMatchStatService],
  exports: [PlayerMatchStatService],
})
export class PlayerMatchStatModule {}