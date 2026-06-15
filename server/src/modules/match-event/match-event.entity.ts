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
import {
  EventOutcome,
  MatchEventType,
  MatchPeriod,
} from '../../common/enums';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Auditable()
@Entity('match_events')
@Index(['playerId'])
@Index(['matchId'])
@Index(['x'])
@Index(['y'])
export class MatchEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'match_id' })
  matchId: number;

  @ManyToOne(() => Match, (match) => match.matchEvents)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ name: 'player_id' })
  playerId: number;

  @ManyToOne(() => Player, (player) => player.matchEvents)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'team_id' })
  teamId: number;

  @ManyToOne(() => Team, (team) => team.matchEvents)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'event_type', type: 'enum', enum: MatchEventType })
  eventType: MatchEventType;

  @Column()
  minute: number;

  @Column({ type: 'float' })
  x: number;

  @Column({ type: 'float' })
  y: number;

  @Column({ name: 'end_x', type: 'float', nullable: true })
  endX: number;

  @Column({ name: 'end_y', type: 'float', nullable: true })
  endY: number;

  @Column({ type: 'enum', enum: EventOutcome, nullable: true })
  outcome: EventOutcome;

  @Column({ type: 'enum', enum: MatchPeriod })
  period: MatchPeriod;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}