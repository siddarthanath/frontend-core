"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { type ReactNode, useState } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
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
        {children}
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
