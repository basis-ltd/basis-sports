import { FileDown, Filter, Map } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const features = [
  {
    icon: Map,
    title: 'Zone heatmaps',
    description:
      'Twelve pitch zones show where a player touches the ball, with intensity mapped from cool green to warm highlight.',
  },
  {
    icon: Filter,
    title: 'Cascading filters',
    description:
      'Narrow from tournament to season, player, and individual matches — every view updates from the same filter bar.',
  },
  {
    icon: FileDown,
    title: 'Exportable reports',
    description:
      'Save any heatmap report as a PNG to share with your scouting team or attach to a player profile.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="landing-section" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">Features</p>
          <h2 id="features-heading" className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
            Scouting intelligence, not just match stats
          </h2>
          <p className="text-muted-foreground">
            Built for analysts who need to understand positioning and activity patterns
            across tournaments and seasons.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/80">
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-4" aria-hidden="true" />
                </div>
                <CardTitle className="font-display text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}