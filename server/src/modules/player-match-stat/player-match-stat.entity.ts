import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Auditable()
@Entity('player_match_stats')
@Index(['matchId', 'playerId'], { unique: true })
export class PlayerMatchStat extends BaseEntity {
  @Column({ name: 'match_id', type: 'uuid' })
  matchId: string;

  @ManyToOne(() => Match, (match) => match.playerMatchStats)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ name: 'player_id', type: 'uuid' })
  playerId: string;

  @ManyToOne(() => Player, (player) => player.matchStats)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'team_id', type: 'uuid' })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.playerMatchStats)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'minutes_played', default: 0 })
  minutesPlayed: number;

  @Column({ default: 0 })
  goals: number;

  @Column({ default: 0 })
  assists: number;

  @Column({ name: 'yellow_cards', default: 0 })
  yellowCards: number;

  @Column({ name: 'red_cards', default: 0 })
  redCards: number;

  @Column({ default: 0 })
  shots: number;

  @Column({ name: 'passes_completed', default: 0 })
  passesCompleted: number;

  @Column({ name: 'distance_covered_m', type: 'float', default: 0 })
  distanceCoveredM: number;

  @Column({ type: 'float', default: 0 })
  xg: number;
}