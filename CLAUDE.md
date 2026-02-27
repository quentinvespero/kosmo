# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kosmo is a social network combining features from X/Twitter and Reddit. Built with Next.js, PostgreSQL, Prisma, and better-auth.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm lint         # Run ESLint

# Database
pnpm db:dev_migration   # Format schema + migrate dev + regenerate Prisma client
pnpm db:studio          # Open Prisma Studio
pnpm ui:add <component> # Add a shadcn/ui component
```

## Architecture

### Route Groups
- `app/(auth)/` — Unauthenticated pages: `/signin`, `/signup`, `/verify`
- `app/(app)/` — Authenticated pages: `/home`
- `app/api/auth/[...all]/` — better-auth catch-all API handler
- `app/graph/` — (reserved, currently empty)

### Key Files
- `lib/auth.ts` — Server-side better-auth config (email/password, rate limiting, Prisma adapter)
- `lib/authClient.ts` — Client-side better-auth methods (`signIn`, `signUp`, `signOut`, `useSession`)
- `lib/prisma.ts` — Prisma client singleton using `@prisma/adapter-pg`
- `lib/schemas/AuthSchemas.ts` — Zod validation schemas for auth forms
- `lib/proxies/` — (for server action proxies)
- `prisma/schema.prisma` — Full data model
- `prisma.config.ts` — Prisma config pointing to `./prisma/schema.prisma`
- `types/webmcp.d.ts` — Extends React HTML attributes with `toolname`, `tooldescription`, `toolparamdescription` for WebMCP form introspection

### Component Conventions
- `components/ui/` — shadcn/ui primitives (button, card, form, input, etc.)
- `components/auth/` — Auth form components (`signinTab.tsx`, `signupTab.tsx`, `signoutButton.tsx`)
- `components/home/` — Home page components
- Forms use `react-hook-form` + `zodResolver` + shadcn `Form`/`Field` components
- Toasts via `sonner` — use `toast.loading`/`toast.success`/`toast.error` with an `id` to deduplicate

### Data Model Summary
Core entities: `User`, `Post`, `Comment`, `Vote`, `Community`, `Feed`, `Tag`, `Draft`
Junction tables: `PostCommunity`, `FeedCommunity`, `FeedUser`, `CommunityMember`
Post privacy: `GLOBAL` | `COMMUNITY` | `PRIVATE`
Vote targets: posts or comments (upvote/downvote)
Communities become orphaned (not deleted) when their owner deletes their account

## Code Style
- TypeScript strict mode, 4-space indent, no trailing semicolons
- Arrow functions throughout
- Server Components by default; add `'use client'` only when needed
- Use Suspense for loading states
