import type { NextConfig } from "next";

// Endpoints the browser is allowed to talk to (Supabase + this app's backend API).
// Pulled from env so the CSP follows whatever project the fork points at.
const connectSrc = [
  "'self'",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_API_URL,
]
  .filter(Boolean)
  .join(" ");

// NOTE on 'unsafe-inline' for scripts: Next's App Router injects inline hydration
// scripts, so a nonce-free CSP needs it. This is the one real weakness here — for a
// production app that handles sensitive data, switch to nonce-based CSP (generate a
// per-request nonce in middleware and pass it to Next) and drop 'unsafe-inline'.
// 'unsafe-eval' is only needed by React Fast Refresh in dev.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
