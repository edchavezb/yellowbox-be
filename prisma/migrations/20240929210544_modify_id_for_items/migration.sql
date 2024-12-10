/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `albumId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUri` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Album` table. All the data in the column will be lost.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artistId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUri` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Artist` table. All the data in the column will be lost.
  - The primary key for the `BoxAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoxAlbum` table. All the data in the column will be lost.
  - The primary key for the `BoxArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoxArtist` table. All the data in the column will be lost.
  - The primary key for the `BoxPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoxPlaylist` table. All the data in the column will be lost.
  - The primary key for the `BoxTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoxTrack` table. All the data in the column will be lost.
  - The primary key for the `DeletedBox` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DeletedBox` table. All the data in the column will be lost.
  - The primary key for the `ItemReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemReview` table. All the data in the column will be lost.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `playlistId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUri` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Playlist` table. All the data in the column will be lost.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `spotifyUri` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Track` table. All the data in the column will be lost.
  - The required column `itemId` was added to the `Album` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `itemId` was added to the `Artist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `boxAlbumId` was added to the `BoxAlbum` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `boxArtistId` was added to the `BoxArtist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `boxPlaylistId` was added to the `BoxPlaylist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `boxTrackId` was added to the `BoxTrack` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `reviewId` was added to the `ItemReview` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `itemId` was added to the `Playlist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `itemId` was added to the `Track` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_albumId_fkey";

-- DropForeignKey
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_boxAlbumId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_boxArtistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_boxPlaylistId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_boxTrackId_fkey";

-- DropForeignKey
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_trackId_fkey";

-- DropIndex
DROP INDEX "Album_spotifyUri_key";

-- DropIndex
DROP INDEX "Album_spotifyUrl_key";

-- DropIndex
DROP INDEX "Artist_spotifyUri_key";

-- DropIndex
DROP INDEX "Artist_spotifyUrl_key";

-- DropIndex
DROP INDEX "Playlist_spotifyUri_key";

-- DropIndex
DROP INDEX "Playlist_spotifyUrl_key";

-- DropIndex
DROP INDEX "Track_spotifyUri_key";

-- DropIndex
DROP INDEX "Track_spotifyUrl_key";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "albumId",
DROP COLUMN "spotifyUri",
DROP COLUMN "spotifyUrl",
ADD COLUMN     "itemId" UUID NOT NULL,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("itemId");

-- AlterTable
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_pkey",
DROP COLUMN "artistId",
DROP COLUMN "spotifyUri",
DROP COLUMN "spotifyUrl",
ADD COLUMN     "itemId" UUID NOT NULL,
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("itemId");

-- AlterTable
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_pkey",
DROP COLUMN "id",
ADD COLUMN     "boxAlbumId" UUID NOT NULL,
ADD CONSTRAINT "BoxAlbum_pkey" PRIMARY KEY ("boxAlbumId");

-- AlterTable
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_pkey",
DROP COLUMN "id",
ADD COLUMN     "boxArtistId" UUID NOT NULL,
ADD CONSTRAINT "BoxArtist_pkey" PRIMARY KEY ("boxArtistId");

-- AlterTable
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_pkey",
DROP COLUMN "id",
ADD COLUMN     "boxPlaylistId" UUID NOT NULL,
ADD CONSTRAINT "BoxPlaylist_pkey" PRIMARY KEY ("boxPlaylistId");

-- AlterTable
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_pkey",
DROP COLUMN "id",
ADD COLUMN     "boxTrackId" UUID NOT NULL,
ADD CONSTRAINT "BoxTrack_pkey" PRIMARY KEY ("boxTrackId");

-- AlterTable
ALTER TABLE "DeletedBox" DROP CONSTRAINT "DeletedBox_pkey",
DROP COLUMN "id",
ADD COLUMN     "deletedBoxId" SERIAL NOT NULL,
ADD CONSTRAINT "DeletedBox_pkey" PRIMARY KEY ("deletedBoxId");

-- AlterTable
ALTER TABLE "ItemReview" DROP CONSTRAINT "ItemReview_pkey",
DROP COLUMN "id",
ADD COLUMN     "reviewId" UUID NOT NULL,
ADD CONSTRAINT "ItemReview_pkey" PRIMARY KEY ("reviewId");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "playlistId",
DROP COLUMN "spotifyUri",
DROP COLUMN "spotifyUrl",
ADD COLUMN     "itemId" UUID NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("itemId");

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
DROP COLUMN "spotifyUri",
DROP COLUMN "spotifyUrl",
DROP COLUMN "trackId",
ADD COLUMN     "itemId" UUID NOT NULL,
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("itemId");

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_boxTrackId_fkey" FOREIGN KEY ("boxTrackId") REFERENCES "BoxTrack"("boxTrackId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_boxAlbumId_fkey" FOREIGN KEY ("boxAlbumId") REFERENCES "BoxAlbum"("boxAlbumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_boxArtistId_fkey" FOREIGN KEY ("boxArtistId") REFERENCES "BoxArtist"("boxArtistId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_boxPlaylistId_fkey" FOREIGN KEY ("boxPlaylistId") REFERENCES "BoxPlaylist"("boxPlaylistId") ON DELETE CASCADE ON UPDATE CASCADE;
