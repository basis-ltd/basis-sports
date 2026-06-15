import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import type { HeatmapZone } from '@/lib/football'
import { createZoneBreakdownColumns } from '@/components/shared/zone-breakdown-columns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type ZoneBreakdownTableProps = {
  zones: HeatmapZone[]
  totalActions: number
  isLoading?: boolean
  highlightedZoneId?: string | null
  onZoneHover?: (zoneId: string | null) => void
}

export function ZoneBreakdownTable({
  zones,
  totalActions,
  isLoading = false,
  highlightedZoneId = null,
  onZoneHover = () => undefined,
}: ZoneBreakdownTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'count', desc: true }])

  const columns = useMemo(
    () => createZoneBreakdownColumns(totalActions, highlightedZoneId, onZoneHover),
    [totalActions, highlightedZoneId, onZoneHover],
  )

  const table = useReactTable({
    data: zones,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  })

  if (isLoading) {
    return <Skeleton className="h-80 w-full rounded-xl" />
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Zone breakdown</p>
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : undefined}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No zone data for this selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}