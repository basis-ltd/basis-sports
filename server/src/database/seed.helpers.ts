import { Repository } from 'typeorm';
import { AuditLog } from '../audit/audit-log.entity';
import { sanitizeEntity } from '../common/utils/sanitize-entity';
import {
  AuditAction,
  EventOutcome,
  MatchEventType,
  MatchPeriod,
  PlayerPosition,
} from '../common/enums';

export const SEED_METADATA = {
  source: 'system',
  seed: true,
  requestId: 'fifa-wc-2026-seed',
} as const;

interface BoundingBox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

const POSITION_ZONES: Record<PlayerPosition, BoundingBox> = {
  [PlayerPosition.GK]: { xMin: 2, xMax: 12, yMin: 35, yMax: 65 },
  [PlayerPosition.CB]: { xMin: 10, xMax: 25, yMin: 20, yMax: 80 },
  [PlayerPosition.LB]: { xMin: 12, xMax: 32, yMin: 5, yMax: 35 },
  [PlayerPosition.RB]: { xMin: 12, xMax: 32, yMin: 65, yMax: 95 },
  [PlayerPosition.CDM]: { xMin: 25, xMax: 42, yMin: 28, yMax: 72 },
  [PlayerPosition.CM]: { xMin: 35, xMax: 55, yMin: 22, yMax: 78 },
  [PlayerPosition.CAM]: { xMin: 52, xMax: 72, yMin: 28, yMax: 72 },
  [PlayerPosition.LW]: { xMin: 58, xMax: 82, yMin: 5, yMax: 38 },
  [PlayerPosition.RW]: { xMin: 58, xMax: 82, yMin: 62, yMax: 95 },
  [PlayerPosition.ST]: { xMin: 68, xMax: 92, yMin: 32, yMax: 68 },
};

const STAR_OVERRIDES: Record<string, BoundingBox> = {
  'Lionel Messi': { xMin: 62, xMax: 90, yMin: 55, yMax: 88 },
  'Kylian Mbappé': { xMin: 70, xMax: 92, yMin: 30, yMax: 70 },
  'Vinícius Júnior': { xMin: 60, xMax: 88, yMin: 5, yMax: 40 },
  'Harry Kane': { xMin: 72, xMax: 92, yMin: 35, yMax: 65 },
  'Jamal Musiala': { xMin: 55, xMax: 78, yMin: 35, yMax: 65 },
  'Pedri': { xMin: 40, xMax: 62, yMin: 30, yMax: 70 },
  'Christian Pulisic': { xMin: 62, xMax: 88, yMin: 60, yMax: 92 },
  'Hirving Lozano': { xMin: 60, xMax: 86, yMin: 5, yMax: 35 },
};

const EVENT_TYPES_BY_POSITION: Record<PlayerPosition, MatchEventType[]> = {
  [PlayerPosition.GK]: [MatchEventType.CLEARANCE, MatchEventType.PASS, MatchEventType.INTERCEPTION],
  [PlayerPosition.CB]: [MatchEventType.CLEARANCE, MatchEventType.TACKLE, MatchEventType.PASS, MatchEventType.INTERCEPTION],
  [PlayerPosition.LB]: [MatchEventType.PASS, MatchEventType.TACKLE, MatchEventType.DRIBBLE, MatchEventType.CLEARANCE],
  [PlayerPosition.RB]: [MatchEventType.PASS, MatchEventType.TACKLE, MatchEventType.DRIBBLE, MatchEventType.CLEARANCE],
  [PlayerPosition.CDM]: [MatchEventType.PASS, MatchEventType.TACKLE, MatchEventType.INTERCEPTION, MatchEventType.CLEARANCE],
  [PlayerPosition.CM]: [MatchEventType.PASS, MatchEventType.DRIBBLE, MatchEventType.TACKLE, MatchEventType.SHOT],
  [PlayerPosition.CAM]: [MatchEventType.PASS, MatchEventType.DRIBBLE, MatchEventType.SHOT, MatchEventType.GOAL],
  [PlayerPosition.LW]: [MatchEventType.DRIBBLE, MatchEventType.PASS, MatchEventType.SHOT, MatchEventType.GOAL],
  [PlayerPosition.RW]: [MatchEventType.DRIBBLE, MatchEventType.PASS, MatchEventType.SHOT, MatchEventType.GOAL],
  [PlayerPosition.ST]: [MatchEventType.SHOT, MatchEventType.GOAL, MatchEventType.PASS, MatchEventType.DRIBBLE],
};

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function getZone(position: PlayerPosition, playerName: string): BoundingBox {
  return STAR_OVERRIDES[playerName] ?? POSITION_ZONES[position];
}

export interface GeneratedMatchEvent {
  matchId: string;
  playerId: string;
  teamId: string;
  eventType: MatchEventType;
  minute: number;
  x: number;
  y: number;
  endX: number | null;
  endY: number | null;
  outcome: EventOutcome;
  period: MatchPeriod;
}

export function generatePlayerEvents(
  matchId: string,
  playerId: string,
  teamId: string,
  position: PlayerPosition,
  playerName: string,
  eventCount: number,
): GeneratedMatchEvent[] {
  const zone = getZone(position, playerName);
  const eventTypes = EVENT_TYPES_BY_POSITION[position];
  const events: GeneratedMatchEvent[] = [];

  for (let i = 0; i < eventCount; i++) {
    const eventType = eventTypes[randomInt(0, eventTypes.length - 1)];
    const x = round(randomBetween(zone.xMin, zone.xMax));
    const y = round(randomBetween(zone.yMin, zone.yMax));
    const isPass = eventType === MatchEventType.PASS;
    const endX = isPass ? round(clamp(x + randomBetween(-15, 25), 0, 100)) : null;
    const endY = isPass ? round(clamp(y + randomBetween(-20, 20), 0, 100)) : null;

    events.push({
      matchId,
      playerId,
      teamId,
      eventType,
      minute: randomInt(1, 90),
      x,
      y,
      endX,
      endY,
      outcome: Math.random() > 0.2 ? EventOutcome.SUCCESS : EventOutcome.FAIL,
      period: Math.random() > 0.5 ? MatchPeriod.FIRST_HALF : MatchPeriod.SECOND_HALF,
    });
  }

  return events;
}

export function generatePlayerMatchStat(
  matchId: string,
  playerId: string,
  teamId: string,
  position: PlayerPosition,
  events: GeneratedMatchEvent[],
) {
  const goals = events.filter((e) => e.eventType === MatchEventType.GOAL).length;
  const shots = events.filter((e) => e.eventType === MatchEventType.SHOT || e.eventType === MatchEventType.GOAL).length;
  const passesCompleted = events.filter(
    (e) => e.eventType === MatchEventType.PASS && e.outcome === EventOutcome.SUCCESS,
  ).length;

  return {
    matchId,
    playerId,
    teamId,
    minutesPlayed: position === PlayerPosition.GK ? 90 : randomInt(60, 90),
    goals,
    assists: randomInt(0, Math.min(2, goals + 1)),
    yellowCards: Math.random() > 0.9 ? 1 : 0,
    redCards: 0,
    shots,
    passesCompleted,
    distanceCoveredM: round(randomBetween(8000, 11500)),
    xg: round(goals * 0.4 + shots * 0.08),
  };
}

export async function bulkAuditCreate(
  auditRepo: Repository<AuditLog>,
  entityName: string,
  entities: object[],
  chunkSize = 500,
): Promise<void> {
  for (let i = 0; i < entities.length; i += chunkSize) {
    const chunk = entities.slice(i, i + chunkSize);
    const logs = chunk
      .map((entity) => {
        const entityId = (entity as { id?: unknown }).id;
        if (typeof entityId !== 'string') {
          return null;
        }

        return auditRepo.create({
          action: AuditAction.CREATE,
          entityName,
          entityId,
          newValue: sanitizeEntity(entity),
          metadata: { ...SEED_METADATA },
        });
      })
      .filter((log): log is AuditLog => log !== null);

    if (logs.length > 0) {
      await auditRepo.save(logs);
    }
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}