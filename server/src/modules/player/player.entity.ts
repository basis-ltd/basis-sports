import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { PlayerPosition } from '../../common/enums';
import { MatchEvent } from '../match-event/match-event.entity';
import { PlayerMatchStat } from '../player-match-stat/player-match-stat.entity';
import { Team } from '../team/team.entity';

@Auditable()
@Entity('players')
@Index(['currentTeamId'])
export class Player extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: PlayerPosition })
  position: PlayerPosition;

  @Column({ nullable: true })
  nationality: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: string;

  @Column({ name: 'height_cm', nullable: true })
  heightCm: number;

  @Column({ name: 'weight_kg', nullable: true })
  weightKg: number;

  @Column({ name: 'preferred_foot', nullable: true })
  preferredFoot: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ name: 'current_team_id', type: 'uuid', nullable: true })
  currentTeamId: string | null;

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  @JoinColumn({ name: 'current_team_id' })
  currentTeam: Team;

  @OneToMany(() => MatchEvent, (event) => event.player)
  matchEvents: MatchEvent[];

  @OneToMany(() => PlayerMatchStat, (stat) => stat.player)
  matchStats: PlayerMatchStat[];
}