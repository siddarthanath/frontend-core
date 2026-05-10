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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
