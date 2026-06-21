import { z } from "zod"

// better-auth generates user IDs itself (not Prisma cuids), so they are validated
// as generic bounded non-empty strings rather than with z.cuid().
const userIdSchema = z.string().min(1).max(255)

// Same username format as signup/settings (AuthSchemas / SettingsSchemas).
// Used here only as the revalidatePath() target, so it stays permissive but bounded.
const usernameSchema = z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)

// followUser / unfollowUser — take the target's id (DB query) and username (cache key)
export const followActionSchema = z.object({
    targetUserId: userIdSchema,
    targetUsername: usernameSchema,
})

// acceptFollowRequest / rejectFollowRequest — take the requesting follower's id
export const followRequestSchema = z.object({
    followerId: userIdSchema,
})
