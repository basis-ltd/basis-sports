import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { AppRoutes } from '@/routes'

type ProvidersProps = {
  children?: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AppRoutes>{children}</AppRoutes>
    </Provider>
  )
}