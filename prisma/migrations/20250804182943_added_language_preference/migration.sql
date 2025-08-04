-- CreateEnum
CREATE TYPE "public"."Languages" AS ENUM ('ENGLISH', 'FRENCH', 'JAPANESE', 'GERMAN');

-- AlterTable
ALTER TABLE "public"."UserPreferences" ADD COLUMN     "language" "public"."Languages" NOT NULL DEFAULT 'ENGLISH';
