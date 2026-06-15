import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
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
export class MatchEvent extends BaseEntity {
  @Column({ name: 'match_id', type: 'uuid' })
  matchId: string;

  @ManyToOne(() => Match, (match) => match.matchEvents)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ name: 'player_id', type: 'uuid' })
  playerId: string;

  @ManyToOne(() => Player, (player) => player.matchEvents)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'team_id', type: 'uuid' })
  teamId: string;

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
}