import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-mono transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]",
        secondary: "border-white/10 bg-white/5 text-[var(--color-muted)]",
        outline: "border-white/15 text-[var(--color-text)]",
        success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        warning: "border-amber-500/25 bg-amber-500/10 text-amber-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
