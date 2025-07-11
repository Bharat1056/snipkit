import { Zap } from "lucide-react"

export const hero = {
  badge: {
    text: "Now in Beta",
    icon: Zap,
  },
  title: (
    <>
      Build faster in your{" "}
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        terminal
      </span>
    </>
  ),
  description:
    "A modern CLI-first snippet manager that lets you save, share, and paste reusable code directly into your editor — from any terminal, anywhere.",
  cta: {
    primary: {
      label: "Get started for free",
      href: "/dashboard",
    },
    secondary: {
      label: "Learn more",
      href: "#features",
    },
  },
}
