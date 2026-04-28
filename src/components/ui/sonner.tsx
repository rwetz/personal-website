import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: "var(--color-surface-2)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--color-text)",
          fontFamily: "Geist, system-ui, sans-serif",
        },
        className: "rounded-xl",
      }}
    />
  )
}

export { toast } from "sonner"
