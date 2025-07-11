import Features from "@/components/modules/landing/features/features"
import Stats from "@/components/modules/landing/stats/stats"
import Cta from "@/components/modules/landing/cts/cta"
import Hero from "@/components/modules/landing/hero/Hero"
import LandingPageWalkthrough from "@/components/step-actions"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
     
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      <LandingPageWalkthrough />

      {/* Stats Section */}
      <Stats />

      {/* CTA Section */}
      <Cta />
    </div>
  )
}
