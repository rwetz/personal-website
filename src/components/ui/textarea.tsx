import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border border-white/10 bg-[var(--color-surface-3)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 transition-colors outline-none focus-visible:border-[var(--color-accent)]/60 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
