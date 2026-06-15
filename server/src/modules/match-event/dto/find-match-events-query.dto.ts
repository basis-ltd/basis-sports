import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindMatchEventsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  playerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  teamId?: string;
}