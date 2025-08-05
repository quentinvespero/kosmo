/*
  Warnings:

  - You are about to drop the column `isGlobal` on the `posts` table. All the data in the column will be lost.
  - The `language` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `post_spaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PostPrivacy" AS ENUM ('GLOBAL', 'COMMUNITY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."CommunityRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."post_spaces" DROP CONSTRAINT "post_spaces_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_spaces" DROP CONSTRAINT "post_spaces_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."spaces" DROP CONSTRAINT "spaces_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "isGlobal",
ADD COLUMN     "privacy" "public"."PostPrivacy" NOT NULL DEFAULT 'GLOBAL',
ALTER COLUMN "title" DROP NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "public"."Language" NOT NULL DEFAULT 'ENGLISH';

-- DropTable
DROP TABLE "public"."post_spaces";

-- DropTable
DROP TABLE "public"."spaces";

-- CreateTable
CREATE TABLE "public"."communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,
    "isOrphan" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."drafts" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "language" "public"."Language" NOT NULL DEFAULT 'ENGLISH',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_communities" (
    "postId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "post_communities_pkey" PRIMARY KEY ("postId","communityId")
);

-- CreateTable
CREATE TABLE "public"."community_members" (
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."CommunityRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "community_members_pkey" PRIMARY KEY ("communityId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_key" ON "public"."communities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "communities_slug_key" ON "public"."communities"("slug");

-- AddForeignKey
ALTER TABLE "public"."communities" ADD CONSTRAINT "communities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drafts" ADD CONSTRAINT "drafts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_communities" ADD CONSTRAINT "post_communities_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_communities" ADD CONSTRAINT "post_communities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_members" ADD CONSTRAINT "community_members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_members" ADD CONSTRAINT "community_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
