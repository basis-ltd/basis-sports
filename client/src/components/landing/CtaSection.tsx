import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="landing-section bg-foreground text-background" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="space-y-3">
          <h2 id="cta-heading" className="font-display text-3xl tracking-tight md:text-4xl">
            Start scouting with pitch-level clarity
          </h2>
          <p className="max-w-lg text-background/70">
            Create a free account and generate your first player heatmap from World Cup
            2026 data.
          </p>
        </div>
        <Button
          size="lg"
          variant="secondary"
          className="shrink-0 bg-background text-foreground hover:bg-background/90"
          render={<Link to="/signup" />}
        >
          Create account
        </Button>
      </div>
    </section>
  )
}