/*
  Warnings:

  - You are about to drop the `AlbumReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtistReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlbumReview" DROP CONSTRAINT "AlbumReview_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistReview" DROP CONSTRAINT "ArtistReview_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistReview" DROP CONSTRAINT "PlaylistReview_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TrackReview" DROP CONSTRAINT "TrackReview_authorId_fkey";

-- DropTable
DROP TABLE "AlbumReview";

-- DropTable
DROP TABLE "ArtistReview";

-- DropTable
DROP TABLE "PlaylistReview";

-- DropTable
DROP TABLE "TrackReview";

-- CreateTable
CREATE TABLE "ItemReview" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "reviewSentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ItemReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemReview" ADD CONSTRAINT "ItemReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
