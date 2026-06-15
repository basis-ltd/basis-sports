import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Auditable } from '../../common/decorators/auditable.decorator';
import { TournamentType } from '../../common/enums';
import { Season } from '../season/season.entity';

@Auditable()
@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}