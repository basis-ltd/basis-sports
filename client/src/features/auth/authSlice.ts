import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/lib/auth-storage'
import type { AuthResponse, AuthUser, MeResponse } from './types'

export type AuthState = {
  user: AuthUser | null
  permissions: string[]
  isAuthenticated: boolean
  isHydrating: boolean
}

const initialState: AuthState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isHydrating: getAccessToken() !== null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isHydrating = false
      setAccessToken(action.payload.accessToken)
    },
    setProfile(state, action: PayloadAction<MeResponse>) {
      state.user = action.payload.user
      state.permissions = action.payload.permissions
      state.isAuthenticated = true
      state.isHydrating = false
    },
    logout(state) {
      state.user = null
      state.permissions = []
      state.isAuthenticated = false
      state.isHydrating = false
      clearAccessToken()
    },
    setHydrating(state, action: PayloadAction<boolean>) {
      state.isHydrating = action.payload
    },
    finishHydration(state) {
      state.isHydrating = false
    },
  },
})

export const {
  setCredentials,
  setProfile,
  logout,
  setHydrating,
  finishHydration,
} = authSlice.actions

export default authSlice.reducer