import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { features } from "./constants"

const Features = () => {
  return (
    <section id="features" className="pb-20 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl transition-colors duration-200">
            Everything you need to manage and reuse code — right from your terminal
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground transition-colors duration-200">
            Build, store, and insert your favorite code snippets without ever leaving your terminal.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.iconBg}`}
                  >
                    <Icon className="h-6 w-6 text-primary-foreground transition-colors duration-200" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground transition-colors duration-200">
                    {feature.points.map((point, idx) => (
                      <li className="flex items-center" key={idx}>
                        <CheckCircle className="mr-2 h-4 w-4 text-success" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
