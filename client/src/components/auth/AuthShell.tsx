import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type AuthShellProps = {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6 border border-border rounded-lg p-8">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground tracking-wide">Basis Sports</p>
          <div className="space-y-1">
            <h1 className="text-lg font-medium tracking-tight text-foreground">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="h-0.5 w-12 bg-primary" aria-hidden="true" />
        </div>
        {children}
        {footer ? <div className="text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  )
}

type AuthLinkProps = {
  to: string
  children: ReactNode
  className?: string
}

export function AuthLink({ to, children, className }: AuthLinkProps) {
  return (
    <Link
      to={to}
      className={cn('text-foreground underline underline-offset-4 hover:text-primary', className)}
    >
      {children}
    </Link>
  )
}