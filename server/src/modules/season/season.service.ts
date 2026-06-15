import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './season.entity';

export interface FindSeasonsOptions {
  tournamentId?: string;
}

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  findAll(options: FindSeasonsOptions = {}): Promise<Season[]> {
    const query = this.seasonRepository
      .createQueryBuilder('season')
      .orderBy('season.startDate', 'ASC');

    if (options.tournamentId) {
      query.andWhere('season.tournamentId = :tournamentId', {
        tournamentId: options.tournamentId,
      });
    }

    return query.getMany();
  }
}