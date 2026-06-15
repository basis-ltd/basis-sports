import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link to="/" className="text-sm font-medium tracking-tight text-foreground">
          Basis Sports
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Main">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link to="/login" />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link to="/signup" />}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  )
}