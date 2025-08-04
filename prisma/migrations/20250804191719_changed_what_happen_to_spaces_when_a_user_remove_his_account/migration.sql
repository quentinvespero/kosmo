-- DropForeignKey
ALTER TABLE "public"."spaces" DROP CONSTRAINT "spaces_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."spaces" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."spaces" ADD CONSTRAINT "spaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
