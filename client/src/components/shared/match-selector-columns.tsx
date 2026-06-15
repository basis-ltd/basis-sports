import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { Match } from '@/features/catalog/types'
import { Checkbox } from '@/components/ui/checkbox'

export const matchSelectorColumns: ColumnDef<Match>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all matches"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.homeTeam?.name ?? 'home'} vs ${row.original.awayTeam?.name ?? 'away'}`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'matchDate',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.matchDate), 'dd MMM yyyy'),
  },
  {
    id: 'fixture',
    header: 'Fixture',
    cell: ({ row }) => {
      const home = row.original.homeTeam?.name ?? 'Home'
      const away = row.original.awayTeam?.name ?? 'Away'
      return `${home} vs ${away}`
    },
  },
  {
    accessorKey: 'stage',
    header: 'Stage',
    cell: ({ row }) => row.original.stage ?? '—',
  },
  {
    id: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const { homeScore, awayScore } = row.original
      if (homeScore == null || awayScore == null) return '—'
      return `${homeScore}–${awayScore}`
    },
  },
]