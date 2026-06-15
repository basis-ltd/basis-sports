import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindPlayersQueryDto } from './dto/find-players-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  findAll(options: FindPlayersQueryDto = {}): Promise<Player[]> {
    const query = this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.currentTeam', 'team')
      .orderBy('player.name', 'ASC');

    if (options.search) {
      query.andWhere('LOWER(player.name) LIKE LOWER(:search)', {
        search: `%${options.search}%`,
      });
    }

    if (options.position) {
      query.andWhere('player.position = :position', {
        position: options.position,
      });
    }

    if (options.teamId) {
      query.andWhere('player.currentTeamId = :teamId', {
        teamId: options.teamId,
      });
    }

    return query.getMany();
  }

  findById(id: string): Promise<Player | null> {
    return this.playerRepository.findOne({
      where: { id },
      relations: { currentTeam: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Player> {
    const player = await this.findById(id);
    if (!player) {
      throw new NotFoundException(`Player ${id} not found`);
    }
    return player;
  }

  create(dto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(dto);
    return this.playerRepository.save(player);
  }

  async update(id: string, dto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findByIdOrFail(id);
    Object.assign(player, dto);
    return this.playerRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    const player = await this.findByIdOrFail(id);
    await this.playerRepository.remove(player);
  }
}