/*
  Warnings:

  - You are about to drop the `BoxSubsectionAlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoxSubsectionArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoxSubsectionPlaylist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoxSubsectionTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_albumId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_trackId_fkey";

-- DropTable
DROP TABLE "BoxSubsectionAlbum";

-- DropTable
DROP TABLE "BoxSubsectionArtist";

-- DropTable
DROP TABLE "BoxSubsectionPlaylist";

-- DropTable
DROP TABLE "BoxSubsectionTrack";

-- CreateTable
CREATE TABLE "BoxSubsectionItem" (
    "boxSubsectionId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BoxSubsectionItem_boxSubsectionId_itemId_key" ON "BoxSubsectionItem"("boxSubsectionId", "itemId");

-- AddForeignKey
ALTER TABLE "BoxSubsectionItem" ADD CONSTRAINT "BoxSubsectionItem_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
