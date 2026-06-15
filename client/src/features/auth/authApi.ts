import { api } from '@/store/api'
import { logout, setCredentials, setProfile } from './authSlice'
import type { LoginFormValues, SignupFormValues } from './schemas'
import type { AuthResponse, MessageResponse, MeResponse } from './types'

type ResetPasswordRequest = {
  token: string
  password: string
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          // handled in UI
        }
      },
    }),
    signup: builder.mutation<AuthResponse, SignupFormValues>({
      query: ({ firstName, email, password }) => ({
        url: '/auth/signup',
        method: 'POST',
        body: { firstName, email, password },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          // handled in UI
        }
      },
    }),
    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setProfile(data))
        } catch {
          dispatch(logout())
          dispatch(api.util.resetApiState())
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi