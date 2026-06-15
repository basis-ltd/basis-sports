import { PartialType } from '@nestjs/swagger';
import { CreatePlayerMatchStatDto } from './create-player-match-stat.dto';

export class UpdatePlayerMatchStatDto extends PartialType(
  CreatePlayerMatchStatDto,
) {}