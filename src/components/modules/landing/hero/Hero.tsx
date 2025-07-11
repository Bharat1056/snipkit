import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { hero } from "./constants"
import TerminalCommand from "@/components/ui/terminal-command"

const Hero = () => {
  const Icon = hero.badge.icon

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Icon className="mr-2 h-3 w-3" />
            {hero.badge.text}
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl transition-colors duration-200">
            {hero.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground transition-colors duration-200">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Button size="lg" asChild>
              <Link href={hero.cta.primary.href}>
                {hero.cta.primary.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={hero.cta.secondary.href}>
                {hero.cta.secondary.label}
              </Link>
            </Button>
          </div>
          <div className="flex justify-center mt-6">
        <TerminalCommand command="npm i snipkit" />
      </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
