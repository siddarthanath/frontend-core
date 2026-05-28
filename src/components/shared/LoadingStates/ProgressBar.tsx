import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  label?: string
}

export function ProgressBar({ value, max = 100, className, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-1.5 w-full rounded-full bg-bg-2 overflow-hidden", className)}
      style={{ "--progress": `${percent}%` } as CSSProperties}
    >
      <div className="h-full rounded-full bg-brand transition-all duration-300 w-(--progress)" />
    </div>
  )
}
