import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindMatchesQueryDto } from './dto/find-matches-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  findAll(options: FindMatchesQueryDto = {}): Promise<Match[]> {
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

  findById(id: string): Promise<Match | null> {
    return this.matchRepository.findOne({
      where: { id },
      relations: { homeTeam: true, awayTeam: true, season: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Match> {
    const match = await this.findById(id);
    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }
    return match;
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

  create(dto: CreateMatchDto): Promise<Match> {
    const match = this.matchRepository.create({
      ...dto,
      matchDate: new Date(dto.matchDate),
    });
    return this.matchRepository.save(match);
  }

  async update(id: string, dto: UpdateMatchDto): Promise<Match> {
    const match = await this.findByIdOrFail(id);
    const { matchDate, ...rest } = dto;
    Object.assign(match, rest);
    if (matchDate) {
      match.matchDate = new Date(matchDate);
    }
    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const match = await this.findByIdOrFail(id);
    await this.matchRepository.remove(match);
  }
}