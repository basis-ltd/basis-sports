import { useRef, useState } from 'react'
import { DownloadIcon } from 'lucide-react'
import { FiltersBar } from '@/components/shared/FiltersBar'
import { HeatmapSummaryCards } from '@/components/shared/HeatmapSummaryCards'
import { PitchHeatmap } from '@/components/shared/PitchHeatmap'
import { ZoneBreakdownTable } from '@/components/shared/ZoneBreakdownTable'
import { useGetHeatmapQuery } from '@/features/heatmap/heatmapApi'
import { useHeatmapFilters } from '@/hooks/use-heatmap-filters'
import { exportElementAsPng } from '@/lib/export-report'
import { getApiErrorMessage } from '@/lib/api-error'
import { PITCH_ZONES } from '@/lib/football'
import { Button } from '@/components/ui/button'

const emptyZones = PITCH_ZONES.map((zone) => ({
  ...zone,
  count: 0,
  intensity: 0,
}))

export function HeatmapReport() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const {
    filters,
    isHeatmapReady,
    setTournamentId,
    setSeasonId,
    setPlayer,
    setMatchIds,
  } = useHeatmapFilters()

  const {
    data: heatmap,
    isFetching,
    isError,
    error,
  } = useGetHeatmapQuery(
    {
      playerId: filters.playerId!,
      seasonId: filters.seasonId!,
      matchIds: filters.matchIds,
    },
    { skip: !isHeatmapReady },
  )

  const zones = heatmap?.zones ?? emptyZones
  const totalActions = heatmap?.totalActions ?? 0
  const centroid = heatmap?.centroid ?? { x: 0, y: 0 }
  const player = heatmap?.player

  const handleExport = async () => {
    if (!reportRef.current || !player) return
    setIsExporting(true)
    try {
      const slug = player.name.toLowerCase().replace(/\s+/g, '-')
      await exportElementAsPng(reportRef.current, `heatmap-${slug}.png`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl tracking-tight text-foreground">Heatmap report</h1>
          <p className="text-sm text-muted-foreground">
            Select a tournament, season, player, and matches to generate a zone heatmap.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!player || totalActions === 0 || isExporting}
        >
          <DownloadIcon />
          {isExporting ? 'Exporting…' : 'Export PNG'}
        </Button>
      </div>

      <FiltersBar
        filters={filters}
        onTournamentChange={setTournamentId}
        onSeasonChange={setSeasonId}
        onPlayerChange={setPlayer}
        onMatchIdsChange={setMatchIds}
      />

      {!isHeatmapReady ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Choose filters above to generate a heatmap.
        </div>
      ) : null}

      {isHeatmapReady ? (
        <div ref={reportRef} className="space-y-6 rounded-xl border border-border bg-background p-4 md:p-6">
          {player ? (
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="font-display text-2xl text-foreground">{player.name}</h2>
              <p className="text-sm text-muted-foreground">
                {player.position} · {filters.matchIds.length} match
                {filters.matchIds.length === 1 ? '' : 'es'} selected
              </p>
            </div>
          ) : null}

          {isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(error, 'Could not load heatmap for this selection.')}
            </p>
          ) : null}

          {!isError && !isFetching && totalActions === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events found for this player across the selected matches.
            </p>
          ) : null}

          <PitchHeatmap
            zones={zones}
            totalActions={totalActions}
            isLoading={isFetching}
            highlightedZoneId={highlightedZoneId}
            onZoneHover={setHighlightedZoneId}
          />

          <HeatmapSummaryCards
            totalActions={totalActions}
            centroid={centroid}
            zones={zones}
            isLoading={isFetching}
          />

          <ZoneBreakdownTable
            zones={zones}
            totalActions={totalActions}
            isLoading={isFetching}
            highlightedZoneId={highlightedZoneId}
            onZoneHover={setHighlightedZoneId}
          />
        </div>
      ) : null}
    </div>
  )
}