import { api } from '@/store/api'

export const heatmapApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHeatmap: builder.query<unknown, Record<string, string | number>>({
      query: (params) => ({
        url: '/heatmap',
        params,
      }),
      providesTags: ['Heatmap'],
    }),
  }),
})

export const { useGetHeatmapQuery } = heatmapApi