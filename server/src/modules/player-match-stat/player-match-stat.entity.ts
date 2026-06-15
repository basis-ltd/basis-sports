import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Auditable()
@Entity('player_match_stats')
@Index(['matchId', 'playerId'], { unique: true })
export class PlayerMatchStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'match_id' })
  matchId: number;

  @ManyToOne(() => Match, (match) => match.playerMatchStats)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ name: 'player_id' })
  playerId: number;

  @ManyToOne(() => Player, (player) => player.matchStats)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'team_id' })
  teamId: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}