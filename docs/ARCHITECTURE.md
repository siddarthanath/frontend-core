# Architecture — frontend-core

---

## Route Groups as Access Layers

Next.js App Router route groups (`(name)/`) are the equivalent of a `ProtectedRoute` component in a classic SPA. Each group has its own `layout.tsx` that enforces a different access contract:

| Group | Path | Auth | Shell |
|---|---|---|---|
| `(marketing)` | `/maintenance`, `/` | None | No sidebar |
| `(auth)` | `/login`, `/signup`, `/reset-password` | None | Auth card layout |
| `(app)` | `/app/**` | Required — redirects to `/login` | AppShell + Sidebar |

`(app)/layout.tsx` calls `supabase.auth.getUser()` server-side (contacts Supabase Auth, not just cookies) and redirects unauthenticated users before any HTML is sent. There is no client-side flash of unauthenticated content.

`proxy.ts` (edge middleware) runs before any layout — it refreshes the Supabase session cookie and classifies routes. It uses `getSession()` (cookie-only, optimistic) intentionally: the backend re-verifies the JWT on every API call, so a spoofed cookie here has no real security impact.

---

## Data Flow

```
Server Component (layout/page)
  → HydrateAuthStore (writes user + org to Zustand synchronously before paint)
  → Client Component renders with store already populated
    → TanStack Query hook (useQuery / useMutation)
      → ky HTTP client (attaches Bearer JWT, normalises errors to ErrorEnvelope)
        → backend-core API
```

**Server state** (anything from the backend) lives in TanStack Query. Never `useEffect + fetch`.

**UI state** (sidebar open/closed, modal open/closed, current settings section) lives in Zustand. Never React context for UI state.

The split: if the state comes from an API call, it's TanStack Query. If it's purely about what the UI is doing, it's Zustand.

---

## Error Normalisation

All API errors are caught in the `ky` instance's `beforeError` hook in `src/lib/api/client.ts` and normalised to:

```typescript
{ error: { code: string, message: string, detail: string, request_id: string } }
```

Individual hooks never inspect raw HTTP errors. The global `QueryCache.onError` handler in `providers.tsx` catches `ACCOUNT_DELETED` errors app-wide and redirects to `/login`.

---

## Token-First Styling

All design tokens live in `src/styles/tokens.css` as CSS custom properties:

```css
:root {
  --color-brand: oklch(65% 0.18 35);
  --sidebar-width: 220px;
  --sidebar-collapsed: 52px;
  --header-height: 48px;
}
```

Tailwind classes reference tokens: `bg-brand`, `w-(--sidebar-width)`, `h-(--header-height)`.

To add a new token: define it in `tokens.css`, reference it in Tailwind. Zero component changes needed to retheme.

**No inline `style` props.** No hardcoded hex values in components. If a value needs to be dynamic (e.g. a progress bar width), use a CSS custom property set via `style={{ "--progress": `${pct}%` } as CSSProperties}` and reference it with `w-(--progress)` in the className.

---

## shadcn Boundary

`components/ui/` is managed by shadcn — these files are regenerated when running `npx shadcn add`. Never modify them directly.

Extend via wrapper components in `components/shared/`. If a shadcn component needs custom behaviour, wrap it:

```
components/ui/button.tsx      ← shadcn, do not touch
components/shared/LoadingButton.tsx  ← your wrapper
```

---

## Store Boundaries

**`src/stores/auth.ts`** — `user`, `displayName`, `currentOrg`, `setUser`, `setCurrentOrg`. Populated server-side via `HydrateAuthStore` and kept in sync by TanStack Query mutations. Never write to this store from a hook — only from `HydrateAuthStore` and auth event handlers.

**`src/stores/ui.ts`** — `sidebarCollapsed`, `openModals`, `settingsSection`. Persisted to `localStorage` (sidebar state) and a cookie (so the server can read the initial sidebar state and avoid a collapsed→expanded flash on SSR). Modal state uses a string key array (`openModals`) so multiple modals can be open independently.

---

## Sidebar Collapse

The sidebar uses a single persistent DOM structure — the avatar never unmounts. When collapsed, the text label collapses via `max-width: 0 + opacity: 0` CSS transition, matching the sidebar `duration-200`. This prevents the brand-colour flash that occurs when React unmounts and remounts the avatar element during the transition.

`overflow-hidden` on the `<aside>` prevents any internal overflow from creating scrollbars during the width animation.
