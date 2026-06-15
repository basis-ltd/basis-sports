import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PlayerPosition } from '../../../common/enums';

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: PlayerPosition })
  @IsEnum(PlayerPosition)
  position: PlayerPosition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: '1995-03-15' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  heightCm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredFoot?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  currentTeamId?: string;
}