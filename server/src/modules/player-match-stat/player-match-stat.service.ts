import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerMatchStat } from './player-match-stat.entity';

@Injectable()
export class PlayerMatchStatService {
  constructor(
    @InjectRepository(PlayerMatchStat)
    private readonly playerMatchStatRepository: Repository<PlayerMatchStat>,
  ) {}
}