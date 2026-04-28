import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-white/10 bg-[var(--color-surface-3)] px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 transition-colors outline-none focus-visible:border-[var(--color-accent)]/60 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
