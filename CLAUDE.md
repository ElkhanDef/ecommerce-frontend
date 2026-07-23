@AGENTS.md

# Project Context

Customer-facing e-commerce storefront **plus** the admin panel — both live in this one Next.js app now (decision changed 2026-07-22; originally the admin panel was planned as a separate project). Consumes a Java Spring Boot backend REST API with JWT authentication. Admin-only pages live under `/admin` and are gated by an `ADMIN` role returned by the backend; everything else in the app remains the public/customer storefront described below.

# Role & Working Style

Act as a senior frontend developer (10+ yrs, Next.js/React/TypeScript/Tailwind). Production-grade, clean, best-practice code. **Ask the user before making architectural decisions — decide together.** Prioritize performance, security, and accessibility (a11y). Avoid unnecessary dependencies. Develop incrementally, piece by piece.

# Tech Stack

- Next.js 16.2.10 (App Router, `src/app/`) — read `node_modules/next/dist/docs/` before writing code (see AGENTS.md)
- React 19.2.4
- TypeScript 5 (strict mode)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- ESLint 9 with `eslint-config-next`
- Axios (HTTP client — decided, install when needed)
- Zustand (cart & favorites state — decided, install when needed)

# Architecture Decisions (agreed with user)

- **Auth:** Backend issues JWT (`accessToken` 15 min + `refreshToken` ~7 days, BOTH rotate on refresh). Tokens live in `localStorage` via `src/services/token-storage.ts` (ONLY that module touches localStorage); the Axios interceptor in `src/services/api.ts` attaches `Authorization: Bearer`, auto-refreshes once on 401 (deduped) and clears tokens when refresh fails. Sign-up requires e-mail verification before first sign-in.
- **All API calls live in `src/services/`** (`api.ts` = instance + error normalization, one file per domain e.g. `auth.ts`) — no fetch/axios calls scattered in components.
- **Backend errors:** `{message, validationErrors}` come in Turkish — surface them directly in the UI (`ApiError` from `services/api.ts`); never invent frontend error texts for backend failures. Contract details: `docs/DEVELOPMENT.md`.
- Base URL via `NEXT_PUBLIC_API_URL` (`.env.local`, template in `.env.example`).
- **State:** Zustand stores for cart and favorites, synced with backend (both require login). Products are public.
- **Google login:** NOT implemented for now (no backend support yet) — do not render the button.
- TypeScript interfaces for ALL backend DTOs (in `src/types/`).
- Backend API contract comes from the user's Postman collection — ask for it if endpoint details are unknown; do not invent endpoints.
- **Admin panel (added 2026-07-22):** lives in this same app under `/admin`, gated by a `role` field the backend returns on sign-in/`GET /users/me` (`ADMIN` vs the regular customer role — exact field/values TBD, backend change in progress). The frontend guard is UX only; the backend MUST also enforce role checks on every `/**/management/**` endpoint server-side (e.g. `@PreAuthorize`) — never treat a client-side redirect as the security boundary. Admin wires up the existing backend `/management` endpoints (products, categories, users) that were already implemented but previously unused by any frontend.

# Design System — "Gold Premium"

Luxury boutique feel: warm, inviting, elegant, minimal. Mobile-first responsive. Reference mockup: `docs/design-reference/auth.html` — ALL pages must match this style.

- Colors: primary `#EF9F27`, dark gold `#BA7517`, light gold `#FAC775`, text-on-gold `#412402`, page bg `#f8f9fa`, text `#333` / muted `#666`
- Fonts: headings `Playfair Display` (serif, 600/700), body `DM Sans` (300/400/500) — load via `next/font`
- Shape language: generous border-radius (10–20px), subtle borders (`#ddd`/`#e0e0e0`), soft focus ring `rgba(239,159,39,0.15)`, decorative circles on gold gradient panels

# Rules

1. **Language policy:** ALL code is English — file/folder names, component/function/variable/type names, comments. ONLY customer-facing output is Turkish: UI texts, error/validation messages, metadata (title/description), and URLs (route segment folders like `giris/`, `sepet/` are Turkish because they ARE the URL — this is the one exception to English folder names). **Admin routes are the exception to the exception:** `/admin/**` is internal/staff-only, not customer-facing or SEO-relevant, so its URL segments stay English (e.g. `/admin/products`, not `/admin/urunler`) — though on-screen admin UI text still follows normal Turkish UI-text conventions.
2. Every component follows single-responsibility
3. Apply lazy loading & code splitting where it pays off
4. SEO meta tags (Metadata API) on every page; `/admin/**` pages instead set `robots: { index: false }`
5. Cart & Favorites pages require auth; product pages are public; `/admin/**` requires the `ADMIN` role (not just being logged in)
6. Tech stack changes must also be recorded in `docs/DEVELOPMENT.md`

# Page Roadmap (build in this order)

1. Login/Register (tabbed, per reference design)
2. Home (product grid)
3. Product detail
4. Cart
5. Favorites
6. User profile

# Conventions

- Path alias: `@/*` → `./src/*`
- Shared types live in `src/types/`
- **Turkish URLs:** `/giris`, `/kayit`, `/urun/[slug]`, `/sepet`, `/favoriler`, `/profil`
- **Admin URLs (English, staff-only):** `/admin`, `/admin/products`, `/admin/categories`, `/admin/users`
- Route groups: `(auth)` = no header/footer, gold brand panel layout; `(shop)` = Header + Footer; `(admin)` = admin shell (own layout, `ADMIN`-role guard), not the storefront Header/Footer
- Auth is two separate routes (`/giris`, `/kayit`) sharing `(auth)/layout.tsx`; tabs are Links (`components/auth/AuthTabs.tsx`)
- Design tokens are Tailwind 4 `@theme` vars in `globals.css`: use `gold`, `gold-dark`, `gold-light`, `gold-ink`, `surface` utility colors and `font-serif` (Playfair) / `font-sans` (DM Sans) — do NOT hardcode hex values in components
- Current folder layout is documented in `docs/DEVELOPMENT.md` — keep it in sync
