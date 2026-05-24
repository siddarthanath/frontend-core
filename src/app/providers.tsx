"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type ReactNode, useState, useEffect } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // One-off window augmentation — inline cast is idiomatic for a single property.
    // Move to global.d.ts only if __reactReady is accessed in multiple files.
    ;(window as Window & { __reactReady?: boolean }).__reactReady = true
  }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        next-themes handles SSR, hydration, system preference, and cross-tab sync.
        attribute="class" applies "dark" to <html>. storageKey matches our ui-store
        namespace convention. enableSystem allows the "system" option in ThemeToggle.
      */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
