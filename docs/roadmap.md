# Roadmap

The roadmap page (`/roadmap`) is a public-facing page showing the current development status of Kosmo features. It is accessible to anyone — no authentication required.

## Statuses

| Status   | Label       | Meaning                        |
|----------|-------------|--------------------------------|
| ACTIVE   | In Progress | Actively being worked on       |
| PLANNED  | Planned     | Scheduled for a future release |
| LAUNCHED | Launched    | Shipped and live in production |

Items are displayed in three columns (one per status), ordered by creation date within each column.

## Data Model

```prisma
model RoadmapItem {
  id          String        @id @default(cuid())
  title       String
  description String?
  status      RoadmapStatus
  feedbackId  String?       @unique  // optional 1-to-1 link to a Feedback record
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  feedback Feedback? @relation(...)
}
```

The `feedbackId` field is unique: each `Feedback` record can be linked to at most one roadmap item. This link is informational — it surfaces the original feedback submission that inspired the item.

## Team Member Access

Only users with `isTeamMember = true` on their `User` record can add, edit, or delete roadmap items. This flag is set manually in the database (e.g., via Prisma Studio).

- `isTeamMember` is exposed in the session via better-auth `additionalFields`, so no extra DB query is needed on each page load.
- The team member check is enforced server-side in all three server actions (`createRoadmapItem`, `updateRoadmapItem`, `deleteRoadmapItem`).

## Server Actions

All mutations live in `lib/actions/roadmap.ts`:

- `createRoadmapItem(data)` — creates a new item
- `updateRoadmapItem(data)` — updates title, description, status, and/or linked feedback
- `deleteRoadmapItem(data)` — deletes an item (linked feedback is unlinked, not deleted)

All actions return `{ success: true }` or `{ error: string }`.

## Linked Feedback

When editing or creating an item, team members can optionally link it to a feedback submission. The dropdown only shows feedbacks not already linked to another item. When editing an existing item, its currently-linked feedback is always included in the dropdown.

Setting feedbackId to `null` (selecting "None") unlinks the feedback — the feedback record itself is not deleted.
