import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonScreenProps {
  rows?: number
  className?: string
}

/** Full-page skeleton for page-level loading states. Use instead of a spinner when layout is known. */
export function SkeletonScreen({ rows = 5, className }: SkeletonScreenProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-6", className)}>
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="flex flex-col gap-3 mt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
