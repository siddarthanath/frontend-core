"use client"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-background)" }}
    >
      <p className="font-semibold" style={{ color: "var(--color-foreground)" }}>
        Something went wrong.
      </p>
      <button
        onClick={reset}
        className="text-sm underline"
        style={{ color: "var(--color-brand)" }}
      >
        Try again
      </button>
    </div>
  )
}
