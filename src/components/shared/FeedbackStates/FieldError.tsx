import { XCircle } from "lucide-react"

export function FieldError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-xs text-error">
      <XCircle className="size-3.5 shrink-0" />
      {message}
    </p>
  )
}
