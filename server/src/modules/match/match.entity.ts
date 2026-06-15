import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { MatchStatus } from '../../common/enums';
import { MatchEvent } from '../match-event/match-event.entity';
import { PlayerMatchStat } from '../player-match-stat/player-match-stat.entity';
import { Season } from '../season/season.entity';
import { Team } from '../team/team.entity';

@Auditable()
@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'season_id' })
  seasonId: number;

  @ManyToOne(() => Season, (season) => season.matches)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @Column({ name: 'home_team_id' })
  homeTeamId: number;

  @ManyToOne(() => Team, (team) => team.homeMatches)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: Team;

  @Column({ name: 'away_team_id' })
  awayTeamId: number;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: Team;

  @Column({ name: 'match_date', type: 'timestamp' })
  matchDate: Date;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({ name: 'home_score', nullable: true })
  homeScore: number;

  @Column({ name: 'away_score', nullable: true })
  awayScore: number;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  stage: string;

  @Column({ name: 'group_number', nullable: true })
  groupNumber: number;

  @OneToMany(() => MatchEvent, (event) => event.match)
  matchEvents: MatchEvent[];

  @OneToMany(() => PlayerMatchStat, (stat) => stat.match)
  playerMatchStats: PlayerMatchStat[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}