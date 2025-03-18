/*
  Warnings:

  - You are about to drop the `UserItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemReview" DROP CONSTRAINT "ItemReview_userItemId_fkey";

-- DropForeignKey
ALTER TABLE "UserItem" DROP CONSTRAINT "UserItem_userId_fkey";

-- AlterTable
ALTER TABLE "ItemReview" ADD COLUMN     "itemPlayedStatusUserItemId" UUID;

-- DropTable
DROP TABLE "UserItem";

-- CreateTable
CREATE TABLE "UserQueue" (
    "queueId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserQueue_pkey" PRIMARY KEY ("queueId")
);

-- CreateTable
CREATE TABLE "QueueArtist" (
    "queueArtistId" UUID NOT NULL,
    "artistId" TEXT NOT NULL,
    "queueId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QueueArtist_pkey" PRIMARY KEY ("queueArtistId")
);

-- CreateTable
CREATE TABLE "QueueAlbum" (
    "queueAlbumId" UUID NOT NULL,
    "albumId" TEXT NOT NULL,
    "queueId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QueueAlbum_pkey" PRIMARY KEY ("queueAlbumId")
);

-- CreateTable
CREATE TABLE "QueuePlaylist" (
    "queuePlaylistId" UUID NOT NULL,
    "playlistId" TEXT NOT NULL,
    "queueId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QueuePlaylist_pkey" PRIMARY KEY ("queuePlaylistId")
);

-- CreateTable
CREATE TABLE "QueueTrack" (
    "queueTrackId" UUID NOT NULL,
    "trackId" TEXT NOT NULL,
    "queueId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QueueTrack_pkey" PRIMARY KEY ("queueTrackId")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "tagId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "ItemTag" (
    "itemTagId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "itemId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,

    CONSTRAINT "ItemTag_pkey" PRIMARY KEY ("itemTagId")
);

-- CreateTable
CREATE TABLE "ItemPlayedStatus" (
    "userItemId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "ItemPlayedStatus_pkey" PRIMARY KEY ("userItemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserQueue_userId_key" ON "UserQueue"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPlayedStatus_userId_itemId_key" ON "ItemPlayedStatus"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "UserQueue" ADD CONSTRAINT "UserQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueArtist" ADD CONSTRAINT "QueueArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueArtist" ADD CONSTRAINT "QueueArtist_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "UserQueue"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueAlbum" ADD CONSTRAINT "QueueAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueAlbum" ADD CONSTRAINT "QueueAlbum_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "UserQueue"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuePlaylist" ADD CONSTRAINT "QueuePlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuePlaylist" ADD CONSTRAINT "QueuePlaylist_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "UserQueue"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTrack" ADD CONSTRAINT "QueueTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTrack" ADD CONSTRAINT "QueueTrack_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "UserQueue"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTag" ADD CONSTRAINT "ItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "UserTag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPlayedStatus" ADD CONSTRAINT "ItemPlayedStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReview" ADD CONSTRAINT "ItemReview_itemPlayedStatusUserItemId_fkey" FOREIGN KEY ("itemPlayedStatusUserItemId") REFERENCES "ItemPlayedStatus"("userItemId") ON DELETE SET NULL ON UPDATE CASCADE;
