import { Separator } from '@/components/ui/separator'

const steps = [
  {
    title: 'Select a tournament',
    description: 'Start with FIFA World Cup 2026 or any loaded competition and pick the season you want to analyze.',
  },
  {
    title: 'Choose a player',
    description: 'Search by name or position, then narrow to specific matches where that player appeared.',
  },
  {
    title: 'Read the pitch',
    description: 'The zone heatmap shows touch density, average position, and final-third activity at a glance.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="landing-section border-t border-border/60 bg-muted/30"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">How it works</p>
          <h2 id="how-it-works-heading" className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
            From data to decision in three steps
          </h2>
          <p className="text-muted-foreground">
            The workflow mirrors how scouts actually work — broad context first, then
            player focus, then pitch-level insight.
          </p>
        </div>

        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background text-xs font-medium text-primary tabular-nums">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <Separator className="hidden flex-1 md:block" />
                ) : null}
              </div>
              <h3 className="font-display text-xl text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}