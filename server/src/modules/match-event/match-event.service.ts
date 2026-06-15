import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { FindMatchEventsQueryDto } from './dto/find-match-events-query.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';
import { MatchEvent } from './match-event.entity';

@Injectable()
export class MatchEventService {
  constructor(
    @InjectRepository(MatchEvent)
    private readonly matchEventRepository: Repository<MatchEvent>,
  ) {}

  findAll(options: FindMatchEventsQueryDto = {}): Promise<MatchEvent[]> {
    const query = this.matchEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.match', 'match')
      .leftJoinAndSelect('event.player', 'player')
      .leftJoinAndSelect('event.team', 'team')
      .orderBy('event.minute', 'ASC');

    if (options.matchId) {
      query.andWhere('event.matchId = :matchId', { matchId: options.matchId });
    }

    if (options.playerId) {
      query.andWhere('event.playerId = :playerId', {
        playerId: options.playerId,
      });
    }

    if (options.teamId) {
      query.andWhere('event.teamId = :teamId', { teamId: options.teamId });
    }

    return query.getMany();
  }

  findById(id: string): Promise<MatchEvent | null> {
    return this.matchEventRepository.findOne({
      where: { id },
      relations: { match: true, player: true, team: true },
    });
  }

  async findByIdOrFail(id: string): Promise<MatchEvent> {
    const event = await this.findById(id);
    if (!event) {
      throw new NotFoundException(`Match event ${id} not found`);
    }
    return event;
  }

  async create(dto: CreateMatchEventDto): Promise<MatchEvent> {
    try {
      const event = this.matchEventRepository.create(dto);
      return await this.matchEventRepository.save(event);
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateMatchEventDto): Promise<MatchEvent> {
    const event = await this.findByIdOrFail(id);
    Object.assign(event, dto);
    try {
      return await this.matchEventRepository.save(event);
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const event = await this.findByIdOrFail(id);
    await this.matchEventRepository.remove(event);
  }

  private handleUniqueViolation(error: unknown): void {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { code?: string }).code === '23505'
    ) {
      throw new ConflictException('Match event already exists');
    }
  }
}