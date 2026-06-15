import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindPlayerMatchStatsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  playerId?: string;
}