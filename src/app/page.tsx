import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-fg">Welcome</h1>
          <p className="text-sm text-fg-3">Replace this page in the product layer.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
