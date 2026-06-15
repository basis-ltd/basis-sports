export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export type AuthResponse = {
  accessToken: string
  user: AuthUser
}

export type MeResponse = {
  user: AuthUser
  permissions: string[]
}

export type MessageResponse = {
  message: string
}