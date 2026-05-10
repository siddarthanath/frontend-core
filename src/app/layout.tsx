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
          Anti-flash: runs synchronously before React hydrates.
          Reads the persisted theme from localStorage and applies .dark immediately
          so users on dark mode never see a white flash on first load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('ui-store')||'{}');var t=s?.state?.theme??'system';var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)document.documentElement.classList.add('dark')}catch(_){}`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
