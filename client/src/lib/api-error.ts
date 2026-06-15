import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type ApiErrorBody = {
  statusCode?: number
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object' || !('data' in error)) {
    return fallback
  }

  const fetchError = error as FetchBaseQueryError
  if (!fetchError.data || typeof fetchError.data !== 'object') {
    return fallback
  }

  const body = fetchError.data as ApiErrorBody

  if (body.errors?.general?.[0]) {
    return body.errors.general[0]
  }

  if (typeof body.message === 'string' && body.message.length > 0) {
    return body.message
  }

  return fallback
}