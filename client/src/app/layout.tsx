import type { ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <TooltipProvider>
      <div className="min-h-svh bg-background text-foreground">{children}</div>
    </TooltipProvider>
  )
}