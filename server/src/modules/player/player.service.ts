import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerPosition } from '../../common/enums';
import { Player } from './player.entity';

export interface FindPlayersOptions {
  search?: string;
  position?: PlayerPosition;
  teamId?: string;
}

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  findAll(options: FindPlayersOptions = {}): Promise<Player[]> {
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
}