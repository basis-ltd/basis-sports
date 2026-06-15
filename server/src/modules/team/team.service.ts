import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      order: { name: 'ASC' },
    });
  }

  findById(id: string): Promise<Team | null> {
    return this.teamRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<Team> {
    const team = await this.findById(id);
    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return team;
  }

  create(dto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(dto);
    return this.teamRepository.save(team);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.findByIdOrFail(id);
    Object.assign(team, dto);
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findByIdOrFail(id);
    await this.teamRepository.remove(team);
  }
}