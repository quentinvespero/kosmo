# Kosmo

**Production:** [kosmo.to](https://kosmo.to)

A social network combining features from X/Twitter and Reddit — posts, communities, threaded comments, votes, custom feeds, and magic-link authentication.

Built as a full rewrite of [kosmo_front](https://github.com/quentinvespero/kosmo_front_web) + [kosmo_back](https://github.com/quentinvespero/kosmo_backend), now as a single Next.js monolith.

## Stack

- **Next.js** (App Router, Turbopack)
- **PostgreSQL** + **Prisma** (with `@prisma/adapter-pg`)
- **better-auth** (magic link, rate limiting)
- **shadcn/ui** + **Tailwind CSS**

## Getting Started

```bash
pnpm install
pnpm dev        # dev server at http://localhost:3000
pnpm db:dev_migration  # run migrations + regenerate Prisma client
```

> In dev, magic link URLs are printed to the console instead of being emailed.
