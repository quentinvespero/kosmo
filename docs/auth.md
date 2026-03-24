# Authentication

## Method
- **Magic link** only — no passwords
- Same flow for sign-in and sign-up (`signIn.magicLink()` handles both)
- In dev: magic link URL is printed to the console instead of being emailed

## Onboarding
- After first sign-in, users are redirected to `/onboarding` to set their username
- Users without a username cannot have a public profile (`/[handle]` returns 404)

## Route Protection
- `app/(auth)/` — unauthenticated pages: `/signin`, `/signup`, `/verify`
- `app/(app)/` — authenticated pages, session required

## Key Files
- `lib/auth.ts` — server-side config (magic link plugin, rate limiting, Prisma adapter)
- `lib/authClient.ts` — client-side methods (`signIn`, `signOut`, `useSession`)
- `lib/schemas/AuthSchemas.ts` — Zod validation schemas

## Models
- `User` — core identity
- `Session` — active sessions
- `Account` — linked auth providers
- `Verification` — magic link tokens
- `RateLimit` — brute-force protection
