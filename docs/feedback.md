# Feedback

Users can submit feedback to the developer directly from the app.

## Entry Point

A "Feedback" button in the home page top bar opens a dialog form.

## Model

```prisma
model Feedback {
  id           String       @id @default(cuid())
  userId       String
  user         User         @relation(...)
  type         FeedbackType
  content      String
  showUsername Boolean      @default(true) // whether the author's username is shown publicly
  createdAt    DateTime     @default(now())
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
2. User can toggle "Show my name on this feedback" (default: on); turning it off sets `showUsername: false`
3. On submit, `submitFeedback` server action validates and inserts a row in the `feedback` table
4. The author's upvote is automatically created (Reddit-style: new feedback starts at score 1)
5. The dialog closes on success; a toast confirms submission
6. No notification mechanism exists yet — feedback must be reviewed manually via the DB (e.g. Prisma Studio)

## Feedback List Page

Route: `/feedback` — accessible to all authenticated users.

Displays feedbacks grouped by category via URL-based tabs (`?tab=BUG`, `?tab=FEATURE_REQUEST`, `?tab=GENERAL`). Defaults to `BUG` if no tab is specified.

Each tab shows a count badge (total feedbacks for that type). Items display the submitting user's handle (linked to their profile) and submission date — or "Anonymous" if `showUsername` is false.

### Sorting

Items can be sorted via the `?sort=` URL param:

| Value | Behavior | Default |
|-------|----------|---------|
| `votes` | Most voted first (score desc). Equal-score items fall back to newest first. | ✓ |
| `date` | Newest first (`createdAt` desc). | |

The sort state lives in the URL so links are shareable and the preference survives refresh. Both `?tab` and `?sort` params are preserved when switching between tabs or sort modes.

Sorting is done in memory after fetching: Prisma cannot `orderBy` a computed value like `upvotes − downvotes`, so items are fetched with their votes, the score is computed per item, and the array is sorted server-side before rendering.

Key components:
- `app/(app)/feedback/page.tsx` — Server Component, fetches data and applies sort
- `components/feedback/FeedbackTabs.tsx` — Client tab switcher (URL navigation)
- `components/feedback/FeedbackSortSelector.tsx` — Client sort toggle (URL navigation)
- `components/feedback/FeedbackItem.tsx` — Individual feedback row
- `components/feedback/FeedbackVoteButtons.tsx` — Client Component handling vote UI

## Voting

Each feedback item can be upvoted or downvoted by any authenticated user.

### Model

```prisma
model FeedbackVote {
  id         String   @id @default(cuid())
  type       VoteType // UP | DOWN
  userId     String
  feedbackId String
  createdAt  DateTime @default(now())

  @@unique([userId, feedbackId]) // one vote per user per feedback
}
```

### Score

`score = upvotes − downvotes`, computed at read time from the `FeedbackVote` rows.

### Toggle behavior

- Clicking the active vote type → removes the vote (toggle off)
- Clicking the opposite type → switches the vote
- No vote → creates a new vote

Vote changes are applied optimistically in the UI (`useOptimistic`) and confirmed via the `voteFeedback` server action.
