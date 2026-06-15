import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeasonDto } from './dto/create-season.dto';
import { FindSeasonsQueryDto } from './dto/find-seasons-query.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { Season } from './season.entity';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  findAll(options: FindSeasonsQueryDto = {}): Promise<Season[]> {
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

  findById(id: string): Promise<Season | null> {
    return this.seasonRepository.findOne({
      where: { id },
      relations: { tournament: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Season> {
    const season = await this.findById(id);
    if (!season) {
      throw new NotFoundException(`Season ${id} not found`);
    }
    return season;
  }

  create(dto: CreateSeasonDto): Promise<Season> {
    const season = this.seasonRepository.create(dto);
    return this.seasonRepository.save(season);
  }

  async update(id: string, dto: UpdateSeasonDto): Promise<Season> {
    const season = await this.findByIdOrFail(id);
    Object.assign(season, dto);
    return this.seasonRepository.save(season);
  }

  async remove(id: string): Promise<void> {
    const season = await this.findByIdOrFail(id);
    await this.seasonRepository.remove(season);
  }
}