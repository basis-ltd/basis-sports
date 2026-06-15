import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindSeasonsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tournamentId?: string;
}