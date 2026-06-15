import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEvent } from './match-event.entity';

@Injectable()
export class MatchEventService {
  constructor(
    @InjectRepository(MatchEvent)
    private readonly matchEventRepository: Repository<MatchEvent>,
  ) {}
}