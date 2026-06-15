import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

export interface FindMatchesOptions {
  seasonId?: string;
  teamId?: string;
}

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  findAll(options: FindMatchesOptions = {}): Promise<Match[]> {
    const query = this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('match.season', 'season')
      .orderBy('match.matchDate', 'ASC');

    if (options.seasonId) {
      query.andWhere('match.seasonId = :seasonId', {
        seasonId: options.seasonId,
      });
    }

    if (options.teamId) {
      query.andWhere(
        '(match.homeTeamId = :teamId OR match.awayTeamId = :teamId)',
        { teamId: options.teamId },
      );
    }

    return query.getMany();
  }

  findByIds(ids: string[]): Promise<Match[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    return this.matchRepository
      .createQueryBuilder('match')
      .whereInIds(ids)
      .getMany();
  }
}