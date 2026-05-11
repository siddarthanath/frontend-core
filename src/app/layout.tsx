import type { Metadata } from "next"
import Script from "next/script"
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
          Bfcache / tab-clone fix. Two mechanisms:
          1. pageshow(persisted=true) — fires on back/forward bfcache restores;
             reloads immediately so React re-initialises from scratch.
          2. __reactReady flag + 2000ms timeout — catches Chrome's tab duplication
             which clones the page without running useEffect, so persisted=false
             but React events are still unattached. Providers.tsx sets the flag to
             true in its useEffect; if that never fires the timeout triggers a
             reload. 2000ms >> typical hydration time (~50ms prod, ~1s dev), so
             this never fires on a healthy page load.
        */}
        <Script
          id="bfcache-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `window.addEventListener('pageshow',function(e){if(e.persisted)window.location.reload()});window.__reactReady=false;setTimeout(function(){if(!window.__reactReady)window.location.reload()},2000)` }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
