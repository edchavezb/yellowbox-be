/*
  Warnings:

  - A unique constraint covering the columns `[albumId,queueId]` on the table `QueueAlbum` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artistId,queueId]` on the table `QueueArtist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playlistId,queueId]` on the table `QueuePlaylist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId,queueId]` on the table `QueueTrack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QueueAlbum_albumId_queueId_key" ON "QueueAlbum"("albumId", "queueId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueArtist_artistId_queueId_key" ON "QueueArtist"("artistId", "queueId");

-- CreateIndex
CREATE UNIQUE INDEX "QueuePlaylist_playlistId_queueId_key" ON "QueuePlaylist"("playlistId", "queueId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueTrack_trackId_queueId_key" ON "QueueTrack"("trackId", "queueId");
