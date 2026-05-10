export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-sm rounded-xl p-8 shadow-sm bg-surface border border-border">
        {children}
      </div>
    </div>
  )
}
