import { Link } from 'react-router-dom'
import { PitchHeroVisual } from '@/components/landing/PitchHeroVisual'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="landing-section border-b border-border/60">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <Badge variant="secondary" className="font-normal">
            FIFA World Cup 2026 data
          </Badge>

          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
              See where players actually play
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Zone-based heatmaps and filterable scouting reports — from tournament
              selection to pitch intelligence in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link to="/signup" />}>
              Get started
            </Button>
            <Button variant="outline" size="lg" render={<Link to="/login" />}>
              Sign in
            </Button>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div>
              <dt className="text-xs text-muted-foreground">Zones per pitch</dt>
              <dd className="mt-1 font-display text-2xl tabular-nums text-foreground">12</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Filter depth</dt>
              <dd className="mt-1 font-display text-2xl tabular-nums text-foreground">4</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Export format</dt>
              <dd className="mt-1 font-display text-2xl tabular-nums text-foreground">PNG</dd>
            </div>
          </dl>
        </div>

        <PitchHeroVisual />
      </div>
    </section>
  )
}