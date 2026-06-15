export type PitchZoneBase = {
  id: string
  label: string
  x1: number
  x2: number
  y1: number
  y2: number
}

export type HeatmapZone = PitchZoneBase & {
  count: number
  intensity: number
}

export const PITCH_ZONES: PitchZoneBase[] = [
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
]

export function zoneHeatColor(intensity: number): string {
  if (intensity >= 0.7) return 'var(--heat-warm)'
  if (intensity >= 0.4) return 'oklch(0.55 0.12 145 / 0.55)'
  return 'oklch(0.45 0.14 145 / 0.35)'
}

export function zoneToPixels(
  zone: Pick<PitchZoneBase, 'x1' | 'x2' | 'y1' | 'y2'>,
  pitchWidth: number,
  pitchHeight: number,
): { x: number; y: number; width: number; height: number } {
  const x = (zone.x1 / 100) * pitchWidth
  const y = pitchHeight - (zone.y2 / 100) * pitchHeight
  const width = ((zone.x2 - zone.x1) / 100) * pitchWidth
  const height = ((zone.y2 - zone.y1) / 100) * pitchHeight
  return { x, y, width, height }
}

export function getZoneShare(count: number, totalActions: number): number {
  if (totalActions === 0) return 0
  return Math.round((count / totalActions) * 1000) / 10
}

export function getFinalThirdPercentage(zones: HeatmapZone[], totalActions: number): number {
  if (totalActions === 0) return 0
  const finalThirdTouches = zones
    .filter((zone) => zone.x1 >= 66)
    .reduce((sum, zone) => sum + zone.count, 0)
  return Math.round((finalThirdTouches / totalActions) * 1000) / 10
}