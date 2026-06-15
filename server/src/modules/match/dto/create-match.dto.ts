import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MatchStatus } from '../../../common/enums';

export class CreateMatchDto {
  @ApiProperty()
  @IsUUID()
  seasonId: string;

  @ApiProperty()
  @IsUUID()
  homeTeamId: string;

  @ApiProperty()
  @IsUUID()
  awayTeamId: string;

  @ApiProperty({ example: '2026-06-15T18:00:00.000Z' })
  @IsDateString()
  matchDate: string;

  @ApiPropertyOptional({ enum: MatchStatus })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  homeScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  awayScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  groupNumber?: number;
}