import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Top bar with theme toggle so users can switch before logging in */}
      <div className="flex justify-end px-4 py-3">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl p-8 shadow-sm bg-surface border border-border">
          {children}
        </div>
      </div>
    </div>
  )
}
