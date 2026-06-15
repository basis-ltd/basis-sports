import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { TournamentType } from '../../../common/enums';

export class CreateTournamentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: TournamentType, default: TournamentType.CUP })
  @IsOptional()
  @IsEnum(TournamentType)
  type?: TournamentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}