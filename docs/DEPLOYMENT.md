# Deployment — frontend-core

Things to do (or know) before deploying this app.

---

## 1. Environment

Set these in your host (Vercel, etc.) — all are build-/run-time public values except
none here are secret, but they must point at production resources:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the anon (public) key. Never the service role key.
- `NEXT_PUBLIC_API_URL` — the deployed `backend-core` base URL. The default
  `http://localhost:8000` will fail in production.

The backend must be reachable at `NEXT_PUBLIC_API_URL` and must list this app's origin
in its `CORS_ORIGINS`.

---

## 2. Content-Security-Policy tuning

`next.config.ts` ships a CSP that includes `'unsafe-inline'` for scripts, because the
App Router injects inline hydration scripts and we don't set a nonce. This is the one
real weakness in the header setup.

For an app handling sensitive data, switch to **nonce-based CSP**: generate a per-request
nonce in `proxy.ts`, pass it through to Next, and drop `'unsafe-inline'` from `script-src`.
The `connect-src` directive is built from `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_API_URL` — if you add other external calls (analytics, Sentry), add their
origins there or they'll be blocked.

---

## 3. Maintenance mode

Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` to redirect all routes to `/maintenance`
(handled in `proxy.ts`). Set `NEXT_PUBLIC_SUPPORT_EMAIL` so the maintenance and
account-deleted messages show a real contact address.

---

## 4. Error reporting

`ErrorBoundary` (`src/components/shared/FeedbackStates/ErrorBoundary.tsx`) currently
logs unhandled render errors to the console only. Before real traffic, wire
`componentDidCatch` to Sentry (or equivalent) — the swap point is marked with a comment.

---

## 5. Build & verify

```bash
npm run build        # must pass with zero type errors
npm run test -- --run
npx playwright test  # public flows; authenticated flows need test creds (see TESTING.md)
```

Deploy the standard Next.js production build. Ensure the platform terminates TLS — the
Supabase session lives in cookies and must never travel over plain HTTP.
