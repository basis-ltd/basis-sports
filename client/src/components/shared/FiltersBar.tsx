import { useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import type { HeatmapFilters } from '@/hooks/use-heatmap-filters'
import {
  useGetMatchesQuery,
  useGetPlayerMatchStatsQuery,
  useGetPlayersQuery,
  useGetSeasonsQuery,
  useGetTournamentsQuery,
} from '@/features/catalog/catalogApi'
import { MatchSelectorTable } from '@/components/shared/MatchSelectorTable'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type FiltersBarProps = {
  filters: HeatmapFilters
  onTournamentChange: (tournamentId: string | null) => void
  onSeasonChange: (seasonId: string | null) => void
  onPlayerChange: (playerId: string | null, playerName: string | null) => void
  onMatchIdsChange: (matchIds: string[]) => void
}

export function FiltersBar({
  filters,
  onTournamentChange,
  onSeasonChange,
  onPlayerChange,
  onMatchIdsChange,
}: FiltersBarProps) {
  const [playerOpen, setPlayerOpen] = useState(false)
  const [playerSearch, setPlayerSearch] = useState('')
  const [debouncedSearch] = useDebounce(playerSearch, 300)

  const { data: tournaments = [], isLoading: tournamentsLoading } = useGetTournamentsQuery()
  const { data: seasons = [], isLoading: seasonsLoading } = useGetSeasonsQuery(
    { tournamentId: filters.tournamentId ?? undefined },
    { skip: !filters.tournamentId },
  )
  const { data: players = [], isFetching: playersFetching } = useGetPlayersQuery(
    { search: debouncedSearch },
    { skip: debouncedSearch.trim().length < 2 },
  )
  const { data: seasonMatches = [], isLoading: matchesLoading } = useGetMatchesQuery(
    { seasonId: filters.seasonId ?? undefined },
    { skip: !filters.seasonId },
  )
  const { data: playerStats = [], isLoading: playerStatsLoading } = useGetPlayerMatchStatsQuery(
    { playerId: filters.playerId ?? undefined },
    { skip: !filters.playerId },
  )

  const playerMatches = useMemo(() => {
    if (!filters.playerId) return []
    const playerMatchIds = new Set(playerStats.map((stat) => stat.matchId))
    return seasonMatches.filter((match) => playerMatchIds.has(match.id))
  }, [filters.playerId, playerStats, seasonMatches])

  const matchesLoadingState = matchesLoading || playerStatsLoading

  return (
    <section className="space-y-6 rounded-xl border border-border bg-card p-4 md:p-6" aria-label="Report filters">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tournament">Tournament</Label>
          <Select
            value={filters.tournamentId ?? ''}
            onValueChange={(value) => onTournamentChange(value || null)}
            disabled={tournamentsLoading}
          >
            <SelectTrigger id="tournament" className="w-full">
              <SelectValue placeholder="Select tournament" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map((tournament) => (
                <SelectItem key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Select
            value={filters.seasonId ?? ''}
            onValueChange={(value) => onSeasonChange(value || null)}
            disabled={!filters.tournamentId || seasonsLoading}
          >
            <SelectTrigger id="season" className="w-full">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Player</Label>
          <Popover open={playerOpen} onOpenChange={setPlayerOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={playerOpen}
                  className="w-full justify-between font-normal"
                  disabled={!filters.seasonId}
                />
              }
            >
              {filters.playerName ?? 'Search player'}
              <ChevronsUpDownIcon className="size-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[var(--anchor-width)] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Type at least 2 characters…"
                  value={playerSearch}
                  onValueChange={setPlayerSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {playersFetching ? 'Searching…' : 'No players found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    {players.map((player) => (
                      <CommandItem
                        key={player.id}
                        value={player.id}
                        onSelect={() => {
                          onPlayerChange(player.id, player.name)
                          setPlayerOpen(false)
                        }}
                      >
                        <span>{player.name}</span>
                        <span className="text-muted-foreground"> · {player.position}</span>
                        <CheckIcon
                          className={cn(
                            'ml-auto size-4',
                            filters.playerId === player.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <MatchSelectorTable
        matches={playerMatches}
        selectedMatchIds={filters.matchIds}
        onSelectionChange={onMatchIdsChange}
        isLoading={matchesLoadingState}
        isDisabled={!filters.playerId || !filters.seasonId}
      />
    </section>
  )
}