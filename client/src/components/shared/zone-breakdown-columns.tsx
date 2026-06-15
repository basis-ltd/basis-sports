import type { ColumnDef } from '@tanstack/react-table'
import type { HeatmapZone } from '@/lib/football'
import { getZoneShare } from '@/lib/football'
import { cn } from '@/lib/utils'

export function createZoneBreakdownColumns(
  totalActions: number,
  highlightedZoneId: string | null,
  onZoneHover: (zoneId: string | null) => void,
): ColumnDef<HeatmapZone>[] {
  return [
    {
      accessorKey: 'label',
      header: 'Zone',
      cell: ({ row }) => (
        <button
          type="button"
          className={cn(
            'text-left hover:text-primary',
            highlightedZoneId === row.original.id && 'font-medium text-primary',
          )}
          onMouseEnter={() => onZoneHover(row.original.id)}
          onMouseLeave={() => onZoneHover(null)}
          onFocus={() => onZoneHover(row.original.id)}
          onBlur={() => onZoneHover(null)}
        >
          {row.original.label}
        </button>
      ),
    },
    {
      accessorKey: 'count',
      header: 'Touches',
      cell: ({ row }) => <span className="tabular-nums">{row.original.count}</span>,
    },
    {
      id: 'share',
      header: 'Share',
      accessorFn: (zone) => getZoneShare(zone.count, totalActions),
      cell: ({ row }) => (
        <span className="tabular-nums">{getZoneShare(row.original.count, totalActions)}%</span>
      ),
    },
    {
      accessorKey: 'intensity',
      header: 'Intensity',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.round(row.original.intensity * 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {Math.round(row.original.intensity * 100)}%
          </span>
        </div>
      ),
    },
  ]
}