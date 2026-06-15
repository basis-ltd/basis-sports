import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SeasonStatus } from '../../../common/enums';

export class CreateSeasonDto {
  @ApiProperty()
  @IsUUID()
  tournamentId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2026-06-11' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-07-19' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: SeasonStatus })
  @IsOptional()
  @IsEnum(SeasonStatus)
  status?: SeasonStatus;
}