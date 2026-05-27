import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Down for maintenance",
  robots: { index: false },
}

// To activate: add a rewrite in middleware.ts that sends all routes here when
// process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-bg-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-3"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-fg">We&apos;ll be right back</h1>
          <p className="text-sm text-fg-3 leading-relaxed">
            We&apos;re performing scheduled maintenance. Your data is safe and
            we&apos;ll be back up shortly.
          </p>
        </div>

        <div className="w-full rounded-lg border border-border bg-bg-2 px-4 py-3 text-left">
          <p className="text-xs text-fg-3">
            If this is urgent, contact us at{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="text-fg underline underline-offset-2 hover:text-fg-2 transition-colors"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
