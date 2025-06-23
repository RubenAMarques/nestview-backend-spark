
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Colors, Typography, Animation } from "@/theme/tokens"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        // Primary luxury button with sophisticated gold accent
        default: "bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-black hover:from-amber-400 hover:to-yellow-400 shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm",
        
        // Elegant ghost button with refined borders
        ghost: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300",
        
        // Sophisticated outline with luxury feel
        outline: "bg-transparent border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60 backdrop-blur-sm",
        
        // Premium floating action button
        floating: "bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-black hover:from-amber-400 hover:to-yellow-400 shadow-xl hover:shadow-2xl rounded-full font-semibold backdrop-blur-sm",
        
        // Refined glass effect
        glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-lg",
        
        // Minimal subtle button
        minimal: "bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200",
        
        // Premium white button for luxury feel
        premium: "bg-white/95 text-black hover:bg-white shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm",
        
        // Sophisticated secondary button
        secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm",
        
        // Elegant destructive button
        destructive: "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50 backdrop-blur-sm",
      },
      size: {
        default: "h-12 px-6 py-3 text-base min-w-[48px]",
        sm: "h-9 px-4 py-2 text-sm min-w-[36px] rounded-xl",
        lg: "h-14 px-8 py-4 text-lg min-w-[56px]",
        icon: "h-12 w-12 rounded-2xl",
        fab: "h-14 w-14 rounded-full",
        touch: "h-12 px-8 py-4 text-base min-w-[48px]", // Touch-optimized
        compact: "h-8 px-3 py-1.5 text-xs min-w-[32px] rounded-lg",
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
        style={{ 
          fontFamily: Typography.button.fontFamily,
          fontWeight: Typography.button.fontWeight,
          letterSpacing: Typography.button.letterSpacing,
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
