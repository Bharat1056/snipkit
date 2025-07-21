"use client"

import Link from "next/link"
import { Star, Zap, ArrowRight, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { hero } from "./constants"
import { TerminalCommand } from "@/components/ui/terminal-command"

const Hero = () => {
  const Icon = hero.badge.icon

  return (
    <section className="min-h-screen aesthetic-bg flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-6xl text-center">
          {/* Aesthetic Badge */}
          <div className="aesthetic-down delay-75">
            <Badge className="mb-12 px-8 py-4 bg-gradient-to-r from-green-500/15 to-emerald-600/15 text-green-300 border-green-500/25 text-base font-semibold backdrop-blur-sm aesthetic-glow">
              <Icon className="mr-3 h-6 w-6" />
              {hero.badge.text}
              <Star className="ml-3 h-6 w-6 fill-current" />
            </Badge>
          </div>

          {/* Elegant Headline */}
          <div className="aesthetic-up delay-150 mb-12">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              <div className="silk-gradient">
                {hero.title}
              </div>
            </h1>
          </div>

          {/* Refined Description */}
          <div className="aesthetic-up delay-225 mb-16">
            <p className="text-2xl sm:text-3xl leading-relaxed text-gray-200/90 max-w-5xl mx-auto font-light">
              {hero.description}
            </p>
          </div>

          {/* Premium Feature Pills */}
          <div className="aesthetic-up delay-300 mb-20">
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {hero.freeFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`aesthetic-card px-8 py-4 delay-${375 + (index * 75)}`}
                >
                  <span className="text-gray-100 font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTAs */}
          <div className="aesthetic-scale delay-450 mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href={hero.cta.primary.href} className="premium-btn premium-btn-primary">
                <div className="flex items-center">
                  <Zap className="mr-4 h-6 w-6" />
                  <span>{hero.cta.primary.label}</span>
                  <ArrowRight className="ml-4 h-6 w-6" />
                </div>
              </Link>
              
              <Link href={hero.cta.secondary.href} className="premium-btn premium-btn-secondary">
                <div className="flex items-center">
                  <Terminal className="mr-3 h-5 w-5" />
                  <span>{hero.cta.secondary.label}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Elegant Terminal Command */}
          <div className="aesthetic-up delay-525 mb-20">
            <div className="inline-block transform hover:scale-105 transition-transform duration-500">
              <TerminalCommand command="npm i -g snipkit && snipkit save my-function" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
