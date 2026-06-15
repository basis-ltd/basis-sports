export interface PitchZone {
  id: string;
  label: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export const PITCH_ZONES: PitchZone[] = [
  { id: 'DEF_LEFT', label: 'Defensive Left', x1: 0, x2: 33, y1: 0, y2: 25 },
  { id: 'DEF_LEFT_CENTER', label: 'Defensive Left Center', x1: 0, x2: 33, y1: 25, y2: 50 },
  { id: 'DEF_RIGHT_CENTER', label: 'Defensive Right Center', x1: 0, x2: 33, y1: 50, y2: 75 },
  { id: 'DEF_RIGHT', label: 'Defensive Right', x1: 0, x2: 33, y1: 75, y2: 100 },
  { id: 'MID_LEFT', label: 'Middle Left', x1: 33, x2: 66, y1: 0, y2: 25 },
  { id: 'MID_LEFT_CENTER', label: 'Middle Left Center', x1: 33, x2: 66, y1: 25, y2: 50 },
  { id: 'MID_RIGHT_CENTER', label: 'Middle Right Center', x1: 33, x2: 66, y1: 50, y2: 75 },
  { id: 'MID_RIGHT', label: 'Middle Right', x1: 33, x2: 66, y1: 75, y2: 100 },
  { id: 'ATT_LEFT', label: 'Attacking Left', x1: 66, x2: 100, y1: 0, y2: 25 },
  { id: 'ATT_LEFT_CENTER', label: 'Attacking Left Center', x1: 66, x2: 100, y1: 25, y2: 50 },
  { id: 'ATT_RIGHT_CENTER', label: 'Attacking Right Center', x1: 66, x2: 100, y1: 50, y2: 75 },
  { id: 'ATT_RIGHT', label: 'Attacking Right', x1: 66, x2: 100, y1: 75, y2: 100 },
];

export function getZoneForPoint(x: number, y: number): PitchZone | null {
  const clampedX = Math.min(100, Math.max(0, x));
  const clampedY = Math.min(100, Math.max(0, y));

  for (const zone of PITCH_ZONES) {
    const isLastXBand = zone.x2 === 100;
    const isLastYBand = zone.y2 === 100;
    const inX =
      clampedX >= zone.x1 &&
      (isLastXBand ? clampedX <= zone.x2 : clampedX < zone.x2);
    const inY =
      clampedY >= zone.y1 &&
      (isLastYBand ? clampedY <= zone.y2 : clampedY < zone.y2);

    if (inX && inY) {
      return zone;
    }
  }

  return null;
}