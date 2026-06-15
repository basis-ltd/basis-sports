import { PITCH_ZONES, zoneHeatColor, zoneToPixels } from '@/lib/football'

export type PitchZone = (typeof PITCH_ZONES)[number] & { intensity: number }

export const HERO_PITCH_ZONES: PitchZone[] = [
  { ...PITCH_ZONES[0], intensity: 0.15 },
  { ...PITCH_ZONES[1], intensity: 0.22 },
  { ...PITCH_ZONES[2], intensity: 0.18 },
  { ...PITCH_ZONES[3], intensity: 0.12 },
  { ...PITCH_ZONES[4], intensity: 0.35 },
  { ...PITCH_ZONES[5], intensity: 0.48 },
  { ...PITCH_ZONES[6], intensity: 0.42 },
  { ...PITCH_ZONES[7], intensity: 0.3 },
  { ...PITCH_ZONES[8], intensity: 0.55 },
  { ...PITCH_ZONES[9], intensity: 0.72 },
  { ...PITCH_ZONES[10], intensity: 0.88 },
  { ...PITCH_ZONES[11], intensity: 0.61 },
]

export { zoneHeatColor, zoneToPixels }