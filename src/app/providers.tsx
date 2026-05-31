"use client"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { toast, Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type ReactNode, useState, useEffect } from "react"
import { ApiResponseError } from "@/lib/api/client"
import { createClient } from "@/lib/auth/client"
import { useAuthStore } from "@/stores/auth"

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // One-off window augmentation — inline cast is idiomatic for a single property.
    // Move to global.d.ts only if __reactReady is accessed in multiple files.
    ;(window as Window & { __reactReady?: boolean }).__reactReady = true
  }, [])

  const [queryClient] = useState(() => {
    const queryCache = new QueryCache({
      onError: async (error) => {
        if (
          error instanceof ApiResponseError &&
          error.error.code === "ACCOUNT_DELETED"
        ) {
          toast.error(`Your account has been deleted — contact ${SUPPORT_EMAIL}`)
          const supabase = createClient()
          await supabase.auth.signOut()
          useAuthStore.getState().setUser(null)
          window.location.assign("/login")
        }
      },
    })
    return new QueryClient({
      queryCache,
      defaultOptions: {
        queries: { staleTime: 60 * 1000, retry: 1 },
      },
    })
  })

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
