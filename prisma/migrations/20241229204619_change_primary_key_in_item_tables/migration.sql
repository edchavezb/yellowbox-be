/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `Album` table. All the data in the column will be lost.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `ItemReview` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `ItemReview` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `ItemReview` table. All the data in the column will be lost.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `Playlist` table. All the data in the column will be lost.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `Track` table. All the data in the column will be lost.
  - Made the column `position` on table `BoxAlbum` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `BoxArtist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `BoxPlaylist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `BoxTrack` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userItemId` to the `ItemReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_albumId_fkey";

-- DropForeignKey
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_trackId_fkey";

-- DropForeignKey
ALTER TABLE "ItemReview" DROP CONSTRAINT "ItemReview_authorId_fkey";

-- DropIndex
DROP INDEX "Album_spotifyId_key";

-- DropIndex
DROP INDEX "Artist_spotifyId_key";

-- DropIndex
DROP INDEX "Playlist_spotifyId_key";

-- DropIndex
DROP INDEX "Track_spotifyId_key";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "itemId",
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("spotifyId");

-- AlterTable
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_pkey",
DROP COLUMN "itemId",
DROP COLUMN "popularity",
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("spotifyId");

-- AlterTable
ALTER TABLE "BoxAlbum" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "albumId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BoxArtist" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "artistId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BoxPlaylist" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "playlistId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BoxTrack" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "trackId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ItemReview" DROP COLUMN "authorId",
DROP COLUMN "itemType",
DROP COLUMN "spotifyId",
ADD COLUMN     "userItemId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "itemId",
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("spotifyId");

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
DROP COLUMN "itemId",
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("spotifyId");

-- CreateTable
CREATE TABLE "UserItem" (
    "userItemId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "queuePosition" INTEGER,

    CONSTRAINT "UserItem_pkey" PRIMARY KEY ("userItemId")
);

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItem" ADD CONSTRAINT "UserItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReview" ADD CONSTRAINT "ItemReview_userItemId_fkey" FOREIGN KEY ("userItemId") REFERENCES "UserItem"("userItemId") ON DELETE CASCADE ON UPDATE CASCADE;
