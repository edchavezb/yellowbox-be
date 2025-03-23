/*
  Warnings:

  - You are about to drop the `ItemPlayedStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPlayedStatus" DROP CONSTRAINT "ItemPlayedStatus_userId_fkey";

-- DropForeignKey
ALTER TABLE "ItemReview" DROP CONSTRAINT "ItemReview_itemPlayedStatusUserItemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_userId_fkey";

-- DropTable
DROP TABLE "ItemPlayedStatus";

-- DropTable
DROP TABLE "ItemReview";

-- DropTable
DROP TABLE "ItemTag";

-- DropTable
DROP TABLE "UserTag";

-- DropEnum
DROP TYPE "ReviewSentiment";
