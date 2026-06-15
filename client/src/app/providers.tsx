import { Provider } from 'react-redux'
import { AuthBootstrap } from '@/components/auth/AuthBootstrap'
import { AppRoutes } from '@/routes'
import { store } from '@/store/store'

export function Providers() {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <AppRoutes />
    </Provider>
  )
}