export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-background)" }}
    >
      <p className="text-6xl font-bold" style={{ color: "var(--color-muted)" }}>
        404
      </p>
      <p style={{ color: "var(--color-muted)" }}>Page not found.</p>
      <a href="/" className="text-sm underline" style={{ color: "var(--color-brand)" }}>
        Go home
      </a>
    </div>
  )
}
