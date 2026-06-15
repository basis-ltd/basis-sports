import { useEffect, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { Match } from '@/features/catalog/types'
import { matchSelectorColumns } from '@/components/shared/match-selector-columns'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type MatchSelectorTableProps = {
  matches: Match[]
  selectedMatchIds: string[]
  onSelectionChange: (matchIds: string[]) => void
  isLoading?: boolean
  isDisabled?: boolean
}

export function MatchSelectorTable({
  matches,
  selectedMatchIds,
  onSelectionChange,
  isLoading = false,
  isDisabled = false,
}: MatchSelectorTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'matchDate', desc: false }])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    const nextSelection = selectedMatchIds.reduce<RowSelectionState>((acc, id) => {
      acc[id] = true
      return acc
    }, {})
    setRowSelection(nextSelection)
  }, [selectedMatchIds])

  const table = useReactTable({
    data: matches,
    columns: matchSelectorColumns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(next)
      onSelectionChange(
        Object.entries(next)
          .filter(([, selected]) => selected)
          .map(([id]) => id),
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: !isDisabled,
  })

  const emptyMessage = useMemo(() => {
    if (isDisabled) return 'Select a season and player to choose matches.'
    if (matches.length === 0) return 'No matches found for this player in the selected season.'
    return null
  }, [isDisabled, matches.length])

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-xl" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Matches</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {selectedMatchIds.length} selected
        </p>
      </div>

      <ScrollArea className="h-72 rounded-xl border border-border">
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
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={matchSelectorColumns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}