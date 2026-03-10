/*
  Warnings:

  - You are about to drop the column `privacy` on the `posts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "allowSubscribersOnPrivateProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "privacy",
ADD COLUMN     "isSubscribersOnly" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "PostPrivacy";

-- CreateTable
CREATE TABLE "follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
