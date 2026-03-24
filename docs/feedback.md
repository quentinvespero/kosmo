# Feedback

Users can submit feedback to the developer directly from the app.

## Entry Point

A "Feedback" button in the home page top bar opens a dialog form.

## Model

```prisma
model Feedback {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(...)
  type      FeedbackType
  content   String
  createdAt DateTime     @default(now())
}

enum FeedbackType {
  BUG             // bug report
  FEATURE_REQUEST // feature request
  GENERAL         // general feedback
}
```

## Constraints

- Content: 10–1000 characters
- User must be authenticated (feedback is linked to the submitting user)
- No rate limiting currently applied

## Lifecycle

1. User opens the dialog and selects a type + writes a message
2. On submit, `submitFeedback` server action validates and inserts a row in the `feedback` table
3. The dialog closes on success; a toast confirms submission
4. No notification mechanism exists yet — feedback must be reviewed manually via the DB (e.g. Prisma Studio)

## Feedback List Page

Route: `/feedback` — accessible to all authenticated users.

Displays feedbacks grouped by category via URL-based tabs (`?tab=BUG`, `?tab=FEATURE_REQUEST`, `?tab=GENERAL`). Defaults to `BUG` if no tab is specified.

Each tab shows a count badge (total feedbacks for that type). Items are sorted newest first and display the submitting user's handle (linked to their profile) and submission date.

Key components:
- `app/(app)/feedback/page.tsx` — Server Component, fetches data
- `components/feedback/FeedbackTabs.tsx` — Client tab switcher (URL navigation)
- `components/feedback/FeedbackItem.tsx` — Individual feedback row
