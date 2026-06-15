import { Navigate } from 'react-router-dom'
import { CtaSection } from '@/components/landing/CtaSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { useAppSelector } from '@/store/hooks'

export default function LandingPage() {
  const { isAuthenticated, isHydrating } = useAppSelector((state) => state.auth)

  if (isHydrating) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}