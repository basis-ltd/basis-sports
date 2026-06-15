import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}