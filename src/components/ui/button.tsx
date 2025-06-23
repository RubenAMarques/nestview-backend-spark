
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl",
        ghost: "bg-transparent border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm",
        outline: "bg-transparent border border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500",
        floating: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl rounded-full",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
        minimal: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        premium: "bg-white text-black hover:bg-gray-100 shadow-md hover:shadow-lg font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[48px]",
        sm: "h-10 px-4 py-2 text-sm min-w-[40px]",
        lg: "h-14 px-8 py-4 text-lg min-w-[56px]",
        icon: "h-12 w-12 rounded-full",
        fab: "h-14 w-14 rounded-full",
        touch: "h-12 px-8 py-4 min-w-[48px]", // Optimized for touch
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
