import { Link } from 'react-router-dom'

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Basis Sports</p>
          <p className="text-xs text-muted-foreground">Football analytics for player scouting</p>
        </div>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground" aria-label="Footer">
          <Link to="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link to="/signup" className="transition-colors hover:text-foreground">
            Create account
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Basis Sports
        </p>
      </div>
    </footer>
  )
}