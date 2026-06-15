import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from './audit/audit.module';
import { AppConfigModule } from './config/config.module';
import { typeOrmConfigFactory } from './config/database.config';
import { HealthModule } from './health/health.module';
import { HeatmapModule } from './modules/heatmap/heatmap.module';
import { MatchEventModule } from './modules/match-event/match-event.module';
import { MatchModule } from './modules/match/match.module';
import { PlayerMatchStatModule } from './modules/player-match-stat/player-match-stat.module';
import { PlayerModule } from './modules/player/player.module';
import { SeasonModule } from './modules/season/season.module';
import { TeamModule } from './modules/team/team.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { UserManagementModule } from './modules/user-management/user-management.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    AuditModule,
    HealthModule,
    TournamentModule,
    SeasonModule,
    TeamModule,
    PlayerModule,
    MatchModule,
    MatchEventModule,
    PlayerMatchStatModule,
    HeatmapModule,
    UserManagementModule,
  ],
})
export class AppModule {}