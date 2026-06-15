import type { HeatmapQuery, HeatmapResult } from '@/features/heatmap/types'
import { api } from '@/store/api'

export const heatmapApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHeatmap: builder.query<HeatmapResult, HeatmapQuery>({
      query: ({ playerId, seasonId, matchIds }) => ({
        url: '/heatmap',
        params: {
          playerId,
          seasonId,
          matchIds: matchIds.join(','),
        },
      }),
      providesTags: ['Heatmap'],
    }),
  }),
})

export const { useGetHeatmapQuery } = heatmapApi