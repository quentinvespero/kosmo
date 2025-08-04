/*
  Warnings:

  - The `language` column on the `UserPreferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('ENGLISH', 'FRENCH', 'JAPANESE', 'GERMAN');

-- AlterTable
ALTER TABLE "public"."UserPreferences" DROP COLUMN "language",
ADD COLUMN     "language" "public"."Language" NOT NULL DEFAULT 'ENGLISH';

-- DropEnum
DROP TYPE "public"."Languages";
