export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8 shadow-sm"
        style={{
          background: "var(--color-background)",
          border: "1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
