"use client"

import { Badge } from "@/components/ui/badge"
import { Terminal, Brain, ArrowRight } from "lucide-react"
import { whyFree } from "./constants"

const WhyFreeFeatures = () => {
  return (
    <section id="why-free" className="min-h-screen aesthetic-bg flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Elegant Header */}
        <div className="mx-auto max-w-6xl text-center mb-24">
          <div className="aesthetic-down delay-75">
            <Badge className="mb-12 px-8 py-4 bg-gradient-to-r from-blue-500/15 to-purple-600/15 text-blue-300 border-blue-500/25 text-base font-semibold backdrop-blur-sm">
              <Terminal className="mr-3 h-6 w-6" />
              Terminal-First Philosophy
            </Badge>
          </div>
          
          <div className="aesthetic-up delay-150 mb-12">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              <div className="silk-gradient">
                {whyFree.title}
              </div>
            </h2>
          </div>
          
          <div className="aesthetic-up delay-225">
            <p className="text-2xl sm:text-3xl leading-relaxed text-gray-200/90 max-w-5xl mx-auto font-light">
              {whyFree.subtitle}
            </p>
          </div>
        </div>

        {/* Elegant Benefits Grid */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {whyFree.reasons.map((reason, index) => (
              <div key={index} className={`aesthetic-up delay-${300 + (index * 75)}`}>
                <div className="aesthetic-card p-12 text-center h-full">
                  <div className="text-8xl mb-8">{reason.icon}</div>
                  <h3 className="text-3xl font-bold text-white mb-8">
                    {reason.title}
                  </h3>
                  <p className="text-gray-200/80 text-xl leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Value Transformation */}
        <div className="max-w-5xl mx-auto">
          <div className="aesthetic-scale delay-525">
            <div className="aesthetic-card p-16 text-center">
              <div className="text-8xl mb-12">🧠</div>
              <h3 className="text-4xl font-bold text-white mb-8">
                Your Brain Is Too Valuable For This
              </h3>
              <p className="text-2xl text-gray-200/80 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
                Stop using mental energy to remember code patterns. Use it to build amazing things instead.
              </p>
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-3">Mental Stress</div>
                  <div className="text-gray-400 text-lg">Context switching</div>
                </div>
                <ArrowRight className="text-5xl text-gray-500" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-3">Creative Flow</div>
                  <div className="text-gray-400 text-lg">Pure productivity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyFreeFeatures 