import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find({
      order: { name: 'ASC' },
    });
  }

  findById(id: string): Promise<Tournament | null> {
    return this.tournamentRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<Tournament> {
    const tournament = await this.findById(id);
    if (!tournament) {
      throw new NotFoundException(`Tournament ${id} not found`);
    }
    return tournament;
  }

  create(dto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentRepository.create(dto);
    return this.tournamentRepository.save(tournament);
  }

  async update(id: string, dto: UpdateTournamentDto): Promise<Tournament> {
    const tournament = await this.findByIdOrFail(id);
    Object.assign(tournament, dto);
    return this.tournamentRepository.save(tournament);
  }

  async remove(id: string): Promise<void> {
    const tournament = await this.findByIdOrFail(id);
    await this.tournamentRepository.remove(tournament);
  }
}