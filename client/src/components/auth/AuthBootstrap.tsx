import { useEffect } from 'react'
import { finishHydration } from '@/features/auth/authSlice'
import { useGetMeQuery } from '@/features/auth/authApi'
import { hasAccessToken } from '@/lib/auth-storage'
import { useAppDispatch } from '@/store/hooks'

export function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const shouldFetch = hasAccessToken()

  useGetMeQuery(undefined, { skip: !shouldFetch })

  useEffect(() => {
    if (!shouldFetch) {
      dispatch(finishHydration())
    }
  }, [dispatch, shouldFetch])

  return null
}