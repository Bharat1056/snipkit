import Link from "next/link"
// import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cta } from "./constants"

const Cta = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl transition-colors duration-200">
            {cta.heading}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground transition-colors duration-200">{cta.subheading}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* <Button size="lg" asChild>
              <Link href={cta.primary.href}>
                {cta.primary.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}
            <Button variant="outline" size="lg" asChild>
              <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta
