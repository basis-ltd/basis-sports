import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  EventOutcome,
  MatchEventType,
  MatchPeriod,
} from '../../../common/enums';

export class CreateMatchEventDto {
  @ApiProperty()
  @IsUUID()
  matchId: string;

  @ApiProperty()
  @IsUUID()
  playerId: string;

  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty({ enum: MatchEventType })
  @IsEnum(MatchEventType)
  eventType: MatchEventType;

  @ApiProperty()
  @IsNumber()
  minute: number;

  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  y: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  endX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  endY?: number;

  @ApiPropertyOptional({ enum: EventOutcome })
  @IsOptional()
  @IsEnum(EventOutcome)
  outcome?: EventOutcome;

  @ApiProperty({ enum: MatchPeriod })
  @IsEnum(MatchPeriod)
  period: MatchPeriod;
}