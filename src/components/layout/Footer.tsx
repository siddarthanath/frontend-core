export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="text-center text-xs text-fg-3">
          © {year} Template. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
