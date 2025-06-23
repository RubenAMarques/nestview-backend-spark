
import * as React from "react"
import { cn } from "@/lib/utils"
import { Colors, BorderRadius, Shadows } from "@/theme/tokens"

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'premium' | 'subtle'
  glow?: boolean
}

const LuxuryCard = React.forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant = 'elevated', glow = false, ...props }, ref) => {
    const getCardStyles = () => {
      switch (variant) {
        case 'glass':
          return cn(
            "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            glow && "shadow-[0_8px_32px_rgba(212,175,55,0.1)]"
          )
        case 'premium':
          return cn(
            "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
            "border border-white/[0.06] backdrop-blur-sm",
            "shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
            glow && "shadow-[0_12px_40px_rgba(212,175,55,0.08)]"
          )
        case 'subtle':
          return cn(
            "bg-white/[0.02] border border-white/[0.04]",
            "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          )
        default: // elevated
          return cn(
            "bg-[#141416] border border-white/[0.06]",
            "shadow-[0_6px_24px_rgba(0,0,0,0.12)]",
            glow && "shadow-[0_6px_24px_rgba(212,175,55,0.06)]"
          )
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300 ease-out",
          getCardStyles(),
          "hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
          glow && "hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)]",
          className
        )}
        {...props}
      />
    )
  }
)
LuxuryCard.displayName = "LuxuryCard"

const LuxuryCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
))
LuxuryCardHeader.displayName = "LuxuryCardHeader"

const LuxuryCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
))
LuxuryCardContent.displayName = "LuxuryCardContent"

const LuxuryCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-4", className)}
    {...props}
  />
))
LuxuryCardFooter.displayName = "LuxuryCardFooter"

export { LuxuryCard, LuxuryCardHeader, LuxuryCardContent, LuxuryCardFooter }
