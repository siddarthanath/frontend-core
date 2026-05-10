interface ErrorStateProps {
  code?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ code, message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="font-semibold text-error">{code ?? "Error"}</p>
      <p className="text-sm text-fg-2">{message ?? "Something went wrong."}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm underline text-brand">
          Try again
        </button>
      )}
    </div>
  )
}
