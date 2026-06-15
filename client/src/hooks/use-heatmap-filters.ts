import { useCallback, useState } from 'react'

export type HeatmapFilters = {
  tournamentId: string | null
  seasonId: string | null
  playerId: string | null
  playerName: string | null
  matchIds: string[]
}

const initialFilters: HeatmapFilters = {
  tournamentId: null,
  seasonId: null,
  playerId: null,
  playerName: null,
  matchIds: [],
}

export function useHeatmapFilters() {
  const [filters, setFilters] = useState<HeatmapFilters>(initialFilters)

  const setTournamentId = useCallback((tournamentId: string | null) => {
    setFilters({
      tournamentId,
      seasonId: null,
      playerId: null,
      playerName: null,
      matchIds: [],
    })
  }, [])

  const setSeasonId = useCallback((seasonId: string | null) => {
    setFilters((current) => ({
      ...current,
      seasonId,
      playerId: null,
      playerName: null,
      matchIds: [],
    }))
  }, [])

  const setPlayer = useCallback((playerId: string | null, playerName: string | null) => {
    setFilters((current) => ({
      ...current,
      playerId,
      playerName,
      matchIds: [],
    }))
  }, [])

  const setMatchIds = useCallback((matchIds: string[]) => {
    setFilters((current) => ({
      ...current,
      matchIds,
    }))
  }, [])

  const isHeatmapReady =
    !!filters.playerId && !!filters.seasonId && filters.matchIds.length > 0

  return {
    filters,
    isHeatmapReady,
    setTournamentId,
    setSeasonId,
    setPlayer,
    setMatchIds,
  }
}