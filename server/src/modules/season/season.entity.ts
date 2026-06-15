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
import { SeasonStatus } from '../../common/enums';
import { Match } from '../match/match.entity';
import { Tournament } from '../tournament/tournament.entity';

@Auditable()
@Entity('seasons')
@Index(['tournamentId'])
export class Season extends BaseEntity {
  @Column({ name: 'tournament_id', type: 'uuid' })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.seasons)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column()
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({
    type: 'enum',
    enum: SeasonStatus,
    default: SeasonStatus.UPCOMING,
  })
  status: SeasonStatus;

  @OneToMany(() => Match, (match) => match.season)
  matches: Match[];
}