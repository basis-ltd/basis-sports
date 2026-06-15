import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './season.entity';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}
}