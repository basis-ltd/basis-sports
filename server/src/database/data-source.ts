import { config as loadEnv } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AuditLog } from '../audit/audit-log.entity';
import { MatchEvent } from '../modules/match-event/match-event.entity';
import { Match } from '../modules/match/match.entity';
import { PlayerMatchStat } from '../modules/player-match-stat/player-match-stat.entity';
import { Player } from '../modules/player/player.entity';
import { Season } from '../modules/season/season.entity';
import { Team } from '../modules/team/team.entity';
import { Tournament } from '../modules/tournament/tournament.entity';

loadEnv({ path: join(__dirname, '..', '..', '..', '.env') });
loadEnv();

const isDevelopment = process.env.NODE_ENV === 'development';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Tournament,
    Season,
    Team,
    Player,
    Match,
    MatchEvent,
    PlayerMatchStat,
    AuditLog,
  ],
  synchronize:
    isDevelopment && process.env.TYPEORM_SYNCHRONIZE !== 'false',
  logging: process.env.TYPEORM_LOGGING === 'true',
});