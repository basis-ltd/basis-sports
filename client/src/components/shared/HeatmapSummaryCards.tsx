import type { HeatmapZone } from '@/lib/football'
import { getFinalThirdPercentage } from '@/lib/football'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type HeatmapSummaryCardsProps = {
  totalActions: number
  centroid: { x: number; y: number }
  zones: HeatmapZone[]
  isLoading?: boolean
}

export function HeatmapSummaryCards({
  totalActions,
  centroid,
  zones,
  isLoading = false,
}: HeatmapSummaryCardsProps) {
  const finalThirdPct = getFinalThirdPercentage(zones, totalActions)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Total actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl tabular-nums">{totalActions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg position</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl tabular-nums">
            {centroid.x.toFixed(1)}%, {centroid.y.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Final third</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl tabular-nums">{finalThirdPct}%</p>
        </CardContent>
      </Card>
    </div>
  )
}