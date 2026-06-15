import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePlayerMatchStatDto } from './dto/create-player-match-stat.dto';
import { FindPlayerMatchStatsQueryDto } from './dto/find-player-match-stats-query.dto';
import { UpdatePlayerMatchStatDto } from './dto/update-player-match-stat.dto';
import { PlayerMatchStat } from './player-match-stat.entity';

@Injectable()
export class PlayerMatchStatService {
  constructor(
    @InjectRepository(PlayerMatchStat)
    private readonly playerMatchStatRepository: Repository<PlayerMatchStat>,
  ) {}

  findAll(
    options: FindPlayerMatchStatsQueryDto = {},
  ): Promise<PlayerMatchStat[]> {
    const query = this.playerMatchStatRepository
      .createQueryBuilder('stat')
      .leftJoinAndSelect('stat.match', 'match')
      .leftJoinAndSelect('stat.player', 'player')
      .leftJoinAndSelect('stat.team', 'team')
      .orderBy('stat.createdAt', 'ASC');

    if (options.matchId) {
      query.andWhere('stat.matchId = :matchId', { matchId: options.matchId });
    }

    if (options.playerId) {
      query.andWhere('stat.playerId = :playerId', {
        playerId: options.playerId,
      });
    }

    return query.getMany();
  }

  findById(id: string): Promise<PlayerMatchStat | null> {
    return this.playerMatchStatRepository.findOne({
      where: { id },
      relations: { match: true, player: true, team: true },
    });
  }

  async findByIdOrFail(id: string): Promise<PlayerMatchStat> {
    const stat = await this.findById(id);
    if (!stat) {
      throw new NotFoundException(`Player match stat ${id} not found`);
    }
    return stat;
  }

  async create(dto: CreatePlayerMatchStatDto): Promise<PlayerMatchStat> {
    try {
      const stat = this.playerMatchStatRepository.create(dto);
      return await this.playerMatchStatRepository.save(stat);
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async update(
    id: string,
    dto: UpdatePlayerMatchStatDto,
  ): Promise<PlayerMatchStat> {
    const stat = await this.findByIdOrFail(id);
    Object.assign(stat, dto);
    try {
      return await this.playerMatchStatRepository.save(stat);
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const stat = await this.findByIdOrFail(id);
    await this.playerMatchStatRepository.remove(stat);
  }

  private handleUniqueViolation(error: unknown): void {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { code?: string }).code === '23505'
    ) {
      throw new ConflictException(
        'Player match stat already exists for this match and player',
      );
    }
  }
}