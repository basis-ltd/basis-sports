import { Column, Entity, OneToMany } from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { Match } from '../match/match.entity';
import { MatchEvent } from '../match-event/match-event.entity';
import { Player } from '../player/player.entity';
import { PlayerMatchStat } from '../player-match-stat/player-match-stat.entity';

@Auditable()
@Entity('teams')
export class Team extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'short_name', nullable: true })
  shortName: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  confederation: string;

  @Column({ name: 'group_id', nullable: true })
  groupId: number;

  @OneToMany(() => Player, (player) => player.currentTeam)
  players: Player[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];

  @OneToMany(() => MatchEvent, (event) => event.team)
  matchEvents: MatchEvent[];

  @OneToMany(() => PlayerMatchStat, (stat) => stat.team)
  playerMatchStats: PlayerMatchStat[];
}