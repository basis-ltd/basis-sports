import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { MatchEventType } from '../../../common/enums';

export class GetHeatmapQueryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  playerId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  seasonId: string;

  @ApiProperty({
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
    ],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    }

    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }

    return [String(value)];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  matchIds: string[];

  @ApiPropertyOptional({ enum: MatchEventType, isArray: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value;
    }

    return String(value)
      .split(',')
      .map((item) => item.trim());
  })
  @IsArray()
  @IsEnum(MatchEventType, { each: true })
  eventTypes?: MatchEventType[];
}