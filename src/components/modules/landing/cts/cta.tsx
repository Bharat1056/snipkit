"use client"

import Link from "next/link"
import { Brain, Zap, ArrowRight, Users, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cta } from "./constants"

const CTA = () => {
  return (
    <section id="cta" className="min-h-screen aesthetic-bg flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Elegant Stats */}
        <div className="max-w-6xl mx-auto text-center mb-24">
          <div className="aesthetic-down delay-75">
            <Badge className="mb-12 px-8 py-4 bg-gradient-to-r from-green-500/15 to-blue-500/15 text-green-300 border-green-500/25 text-base font-semibold backdrop-blur-sm aesthetic-glow">
              <Brain className="mr-3 h-6 w-6" />
              {cta.stats.title}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-20">
            {cta.stats.metrics.map((metric, index) => (
              <div key={index} className={`aesthetic-scale delay-${150 + (index * 75)}`}>
                <div className="aesthetic-card p-12 text-center">
                  <div className="text-6xl font-bold text-green-400 mb-6">{metric.value}</div>
                  <div className="text-gray-200 text-xl">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <div className="aesthetic-up delay-300 mb-12">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              <div className="silk-gradient">
                {cta.title}
              </div>
            </h2>
          </div>
          
          <div className="aesthetic-up delay-375 mb-12">
            <p className="text-2xl sm:text-3xl leading-relaxed text-gray-200/90 max-w-4xl mx-auto font-light">
              {cta.description}
            </p>
          </div>
          
          <div className="aesthetic-up delay-450 mb-20">
            <p className="text-xl text-gray-300/80 max-w-2xl mx-auto">
              {cta.subtitle}
            </p>
          </div>

          {/* Premium Action Buttons */}
          <div className="aesthetic-scale delay-525 mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href={cta.buttons.primary.href} className="premium-btn premium-btn-primary">
                <div className="flex items-center">
                  <Zap className="mr-4 h-7 w-7" />
                  <span>{cta.buttons.primary.text}</span>
                  <ArrowRight className="ml-4 h-7 w-7" />
                </div>
              </Link>
              
              <Link href={cta.buttons.secondary.href} className="premium-btn premium-btn-secondary">
                <div className="flex items-center">
                  <Terminal className="mr-3 h-6 w-6" />
                  <span>{cta.buttons.secondary.text}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Elegant Final Message */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="aesthetic-scale delay-600">
            <div className="aesthetic-card p-16">
              <div className="text-8xl mb-12">🧠</div>
              <h4 className="text-4xl font-bold text-white mb-8">
                Your Brain Deserves Better
              </h4>
              <p className="text-2xl text-gray-200/80 mb-12 leading-relaxed font-light">
                Stop using mental cycles to remember code. Use them to build amazing things.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-300 text-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-green-400" />
                  <span>Free forever</span>
                </div>
                <div className="hidden sm:block w-2 h-2 rounded-full bg-gray-500"></div>
                <span>No credit card required</span>
                <div className="hidden sm:block w-2 h-2 rounded-full bg-gray-500"></div>
                <span>Setup in 60 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
