import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './tournament.entity';
import { TournamentService } from './tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}