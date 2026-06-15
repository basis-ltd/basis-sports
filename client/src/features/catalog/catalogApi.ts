import type { Match, Player, PlayerMatchStat, Season, Tournament } from '@/features/catalog/types'
import { api } from '@/store/api'

type GetSeasonsParams = { tournamentId?: string }
type GetPlayersParams = { search?: string; position?: string; teamId?: string }
type GetMatchesParams = { seasonId?: string; teamId?: string }
type GetPlayerMatchStatsParams = { playerId?: string; matchId?: string }

export const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTournaments: builder.query<Tournament[], void>({
      query: () => '/tournaments',
      providesTags: ['Tournament'],
    }),
    getSeasons: builder.query<Season[], GetSeasonsParams>({
      query: (params) => ({
        url: '/seasons',
        params,
      }),
      providesTags: ['Season'],
    }),
    getPlayers: builder.query<Player[], GetPlayersParams>({
      query: (params) => ({
        url: '/players',
        params,
      }),
      providesTags: ['Player'],
    }),
    getMatches: builder.query<Match[], GetMatchesParams>({
      query: (params) => ({
        url: '/matches',
        params,
      }),
      providesTags: ['Match'],
    }),
    getPlayerMatchStats: builder.query<PlayerMatchStat[], GetPlayerMatchStatsParams>({
      query: (params) => ({
        url: '/player-match-stats',
        params,
      }),
    }),
  }),
})

export const {
  useGetTournamentsQuery,
  useGetSeasonsQuery,
  useGetPlayersQuery,
  useGetMatchesQuery,
  useGetPlayerMatchStatsQuery,
} = catalogApi