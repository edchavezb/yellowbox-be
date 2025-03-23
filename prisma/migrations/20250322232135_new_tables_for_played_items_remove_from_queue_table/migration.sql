/*
  Warnings:

  - You are about to drop the column `isPlayed` on the `QueueAlbum` table. All the data in the column will be lost.
  - You are about to drop the column `isPlayed` on the `QueueArtist` table. All the data in the column will be lost.
  - You are about to drop the column `isPlayed` on the `QueuePlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `isPlayed` on the `QueueTrack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QueueAlbum" DROP COLUMN "isPlayed";

-- AlterTable
ALTER TABLE "QueueArtist" DROP COLUMN "isPlayed";

-- AlterTable
ALTER TABLE "QueuePlaylist" DROP COLUMN "isPlayed";

-- AlterTable
ALTER TABLE "QueueTrack" DROP COLUMN "isPlayed";

-- CreateTable
CREATE TABLE "PlayedArtist" (
    "playedArtistId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "artistId" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "PlayedArtist_pkey" PRIMARY KEY ("playedArtistId")
);

-- CreateTable
CREATE TABLE "PlayedAlbum" (
    "playedAlbumId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "albumId" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "PlayedAlbum_pkey" PRIMARY KEY ("playedAlbumId")
);

-- CreateTable
CREATE TABLE "PlayedTrack" (
    "playedTrackId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "trackId" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "PlayedTrack_pkey" PRIMARY KEY ("playedTrackId")
);

-- CreateTable
CREATE TABLE "PlayedPlaylist" (
    "playedPlaylistId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "playlistId" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "PlayedPlaylist_pkey" PRIMARY KEY ("playedPlaylistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayedArtist_userId_artistId_key" ON "PlayedArtist"("userId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayedAlbum_userId_albumId_key" ON "PlayedAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayedTrack_userId_trackId_key" ON "PlayedTrack"("userId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayedPlaylist_userId_playlistId_key" ON "PlayedPlaylist"("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "PlayedArtist" ADD CONSTRAINT "PlayedArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedArtist" ADD CONSTRAINT "PlayedArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedAlbum" ADD CONSTRAINT "PlayedAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedAlbum" ADD CONSTRAINT "PlayedAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedTrack" ADD CONSTRAINT "PlayedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedTrack" ADD CONSTRAINT "PlayedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedPlaylist" ADD CONSTRAINT "PlayedPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayedPlaylist" ADD CONSTRAINT "PlayedPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE;
