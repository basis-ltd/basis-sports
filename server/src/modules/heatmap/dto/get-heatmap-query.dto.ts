import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { MatchEventType } from '../../../common/enums';

export class GetHeatmapQueryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seasonId: number;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item) => Number(item));
    }

    if (typeof value === 'string') {
      return value.split(',').map((item) => Number(item.trim()));
    }

    return [Number(value)];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  matchIds: number[];

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