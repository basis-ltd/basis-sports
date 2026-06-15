import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/app/layout'
import App from '@/App'

type AppRoutesProps = {
  children?: ReactNode
}

export function AppRoutes({ children }: AppRoutesProps) {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={children ?? <App />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}