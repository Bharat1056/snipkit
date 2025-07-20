import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus-visible:ring-blue-500",
        success:
          "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl focus-visible:ring-green-500",
        warning:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl focus-visible:ring-yellow-500",
        glass:
          "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 shadow-lg hover:bg-white/90 hover:shadow-xl focus-visible:ring-gray-400",
        "auth-primary":
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:ring-blue-500",
        "auth-secondary":
          "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 focus-visible:ring-gray-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-lg px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
