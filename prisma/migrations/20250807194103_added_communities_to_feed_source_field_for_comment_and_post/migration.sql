-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "source" TEXT;

-- CreateTable
CREATE TABLE "public"."feed_communities" (
    "feedId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_communities_pkey" PRIMARY KEY ("feedId","communityId")
);

-- AddForeignKey
ALTER TABLE "public"."feed_communities" ADD CONSTRAINT "feed_communities_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "public"."feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feed_communities" ADD CONSTRAINT "feed_communities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
