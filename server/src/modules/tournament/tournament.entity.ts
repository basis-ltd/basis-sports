import { Column, Entity, OneToMany } from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { TournamentType } from '../../common/enums';
import { Season } from '../season/season.entity';

@Auditable()
@Entity('tournaments')
export class Tournament extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: TournamentType, default: TournamentType.CUP })
  type: TournamentType;

  @Column({ nullable: true })
  country: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @OneToMany(() => Season, (season) => season.tournament)
  seasons: Season[];
}