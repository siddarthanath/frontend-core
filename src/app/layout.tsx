import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/app/providers"

export const metadata: Metadata = {
  title: "App",
  description: "SaaS template",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Bfcache fix: Chrome clones the page memory snapshot when duplicating a
          tab, skipping all useEffect calls and leaving React event handlers
          unattached. This inline script runs synchronously (before React, before
          bfcache can suppress it) and forces a reload when the page is restored
          from the cache — giving React a clean initialisation.
        */}
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('pageshow',function(e){if(e.persisted)window.location.reload()});window.__reactReady=false;setTimeout(function(){if(!window.__reactReady)window.location.reload()},2000)` }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
