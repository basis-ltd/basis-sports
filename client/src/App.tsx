import { Link, useNavigate } from 'react-router-dom'
import { LogOutIcon } from 'lucide-react'
import { HeatmapReport } from '@/features/heatmap/HeatmapReport'
import { logout } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { api } from '@/store/api'
import { Button } from '@/components/ui/button'

export default function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSignOut = () => {
    dispatch(logout())
    dispatch(api.util.resetApiState())
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium tracking-tight text-foreground">
              Basis Sports
            </Link>
            <nav aria-label="App">
              <span className="text-sm text-foreground">Heatmap report</span>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOutIcon />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <HeatmapReport />
      </main>
    </div>
  )
}