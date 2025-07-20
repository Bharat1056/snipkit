"use client"

import Hero from "@/components/modules/landing/hero/Hero"
import WhyFreeFeatures from "@/components/modules/landing/why-free/why-free"
import CTA from "@/components/modules/landing/cts/cta"
import { useAestheticAnimations } from "@/hooks/useAestheticAnimations"

export default function Home() {
  useAestheticAnimations()

  return (
    <main className="min-h-screen">
      <Hero />
      <WhyFreeFeatures />
      <CTA />
    </main>
  )
}
