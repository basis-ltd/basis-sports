import type { HeatmapZone } from '@/lib/football'

export type HeatmapQuery = {
  playerId: string
  seasonId: string
  matchIds: string[]
}

export type HeatmapResult = {
  zones: HeatmapZone[]
  totalActions: number
  centroid: { x: number; y: number }
  player: { id: string; name: string; position: string }
  filters: HeatmapQuery & { eventTypes?: string[] }
}