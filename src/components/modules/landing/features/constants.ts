import { Terminal, Upload, ClipboardList } from "lucide-react"

export const features = [
  {
    icon: Upload,
    iconBg: "bg-blue-500",
    title: "CLI-First Snippet Upload",
    description:
      "Quickly save reusable code snippets directly from your terminal with one command.",
    points: [
      "Cross-platform CLI tool",
      "Language-agnostic snippet support",
      "Instant push to cloud",
    ],
  },
  {
    icon: Terminal,
    iconBg: "bg-green-500",
    title: "Paste to Code Instantly",
    description:
      "No more hunting for snippets. Paste any snippet directly into your code editor from the terminal.",
    points: [
      "Smart context awareness",
      "Auto-format on paste",
      "One-liner insert command",
    ],
  },
  {
    icon: ClipboardList,
    iconBg: "bg-purple-500",
    title: "Organized & Accessible",
    description:
      "Organize snippets by tags and access them from any machine using your unique CLI identity.",
    points: [
      "Tag-based filtering",
      "Encrypted cloud sync",
      "Access from anywhere",
    ],
  },
]
