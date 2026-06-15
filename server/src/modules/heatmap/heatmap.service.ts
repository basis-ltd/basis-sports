import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { getZoneForPoint, PITCH_ZONES } from '../../common/constants/football';
import { MatchEventType } from '../../common/enums';
import { MatchEvent } from '../match-event/match-event.entity';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { GetHeatmapQueryDto } from './dto/get-heatmap-query.dto';

export interface HeatmapZoneResult {
  id: string;
  label: string;
  count: number;
  intensity: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface HeatmapResult {
  zones: HeatmapZoneResult[];
  totalActions: number;
  centroid: { x: number; y: number };
  player: { id: string; name: string; position: string };
  filters: GetHeatmapQueryDto;
}

@Injectable()
export class HeatmapService {
  constructor(
    @InjectRepository(MatchEvent)
    private readonly matchEventRepository: Repository<MatchEvent>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async generate(query: GetHeatmapQueryDto): Promise<HeatmapResult> {
    const player = await this.playerRepository.findOne({
      where: { id: query.playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player ${query.playerId} not found`);
    }

    const matches = await this.matchRepository.find({
      where: {
        id: In(query.matchIds),
        seasonId: query.seasonId,
      },
    });

    if (matches.length === 0) {
      throw new NotFoundException(
        'No matches found for the provided season and match IDs',
      );
    }

    const validMatchIds = matches.map((match) => match.id);
    const eventQuery = this.matchEventRepository
      .createQueryBuilder('event')
      .where('event.playerId = :playerId', { playerId: query.playerId })
      .andWhere('event.matchId IN (:...matchIds)', { matchIds: validMatchIds });

    if (query.eventTypes?.length) {
      eventQuery.andWhere('event.eventType IN (:...eventTypes)', {
        eventTypes: query.eventTypes,
      });
    }

    const events = await eventQuery.getMany();
    const zoneCounts = new Map<string, number>(
      PITCH_ZONES.map((zone) => [zone.id, 0]),
    );

    let sumX = 0;
    let sumY = 0;

    for (const event of events) {
      const zone = getZoneForPoint(event.x, event.y);
      if (zone) {
        zoneCounts.set(zone.id, (zoneCounts.get(zone.id) ?? 0) + 1);
      }
      sumX += event.x;
      sumY += event.y;
    }

    const totalActions = events.length;
    const maxCount = Math.max(...zoneCounts.values(), 1);

    const zones: HeatmapZoneResult[] = PITCH_ZONES.map((zone) => {
      const count = zoneCounts.get(zone.id) ?? 0;
      return {
        id: zone.id,
        label: zone.label,
        count,
        intensity: totalActions === 0 ? 0 : count / maxCount,
        x1: zone.x1,
        x2: zone.x2,
        y1: zone.y1,
        y2: zone.y2,
      };
    });

    return {
      zones,
      totalActions,
      centroid: {
        x: totalActions === 0 ? 0 : Math.round((sumX / totalActions) * 100) / 100,
        y: totalActions === 0 ? 0 : Math.round((sumY / totalActions) * 100) / 100,
      },
      player: {
        id: player.id,
        name: player.name,
        position: player.position,
      },
      filters: {
        ...query,
        eventTypes: query.eventTypes ?? Object.values(MatchEventType),
      },
    };
  }
}