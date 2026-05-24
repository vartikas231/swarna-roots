# Frontend Architecture

## Stack

- Framework: Next.js App Router with React Server Components where practical.
- Styling: global CSS organized by responsibility under `app/styles`.
- Auth: NextAuth with Prisma adapter, JWT sessions, customer email magic links, and admin credentials.
- Data: Prisma models for users, roles, orders, products, accounts, sessions, and verification tokens.

## CSS Structure

- `app/globals.css`: import boundary only.
- `app/styles/tokens.css`: design tokens for spacing, color, radius, shadows, shell width, and admin-controlled theme variables.
- `app/styles/base.css`: resets, element defaults, focus states, image/video defaults, reduced-motion behavior.
- `app/styles/layout.css`: app shell, header, footer, navigation, page width, and persistent actions.
- `app/styles/components.css`: cards, buttons, forms, product cards, galleries, checkout, tracking, admin tables, and loading states.
- `app/styles/responsive.css`: mobile-first breakpoints for phones, tablets, laptops, and wide screens.

## Component Strategy

- Keep shared interaction components in `app/components`, such as auth forms, product cards, galleries, media boards, and providers.
- Prefer server pages that pass simple props into client components instead of calling routing hooks directly in pages.
- Keep product and media containers ratio-based so image loading does not shift layout.
- Use existing class utilities and tokens before adding page-specific CSS.
- Add focused components when a behavior is reused across pages, as with `CustomerAuthForm`.

## Auth Strategy

- Customer access uses email magic links through NextAuth EmailProvider.
- Admin access uses credentials and hashed passwords for users with `ADMIN` or `SUPER_ADMIN` roles.
- Sessions use signed JWT cookies managed by NextAuth, not localStorage.
- `/admin` is protected in `proxy.ts`; `/account` is protected with a server-side session redirect.
- Role checks live in API routes for admin-only mutations.
- `NEXTAUTH_SECRET` is required for production runtime.

## Production Notes

- Add OAuth providers later only if customer conversion needs it; the current stack is smaller and fits the app's Prisma-backed user model.
- Keep visual changes inside tokens and reusable component classes first.
- Keep animations subtle, short, and disabled for reduced-motion users.
- Prefer `loading="lazy"`, `decoding="async"`, `object-fit`, and stable aspect ratios for storefront media.
