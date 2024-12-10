/*
  Warnings:

  - The primary key for the `BoxAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `BoxAlbum` table. All the data in the column will be lost.
  - The primary key for the `BoxArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `BoxArtist` table. All the data in the column will be lost.
  - The primary key for the `BoxPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `BoxPlaylist` table. All the data in the column will be lost.
  - The primary key for the `BoxTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `BoxTrack` table. All the data in the column will be lost.
  - You are about to drop the `BoxSubsectionItem` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `BoxAlbum` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BoxArtist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BoxPlaylist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BoxTrack` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "BoxSubsectionItem" DROP CONSTRAINT "BoxSubsectionItem_boxSubsectionId_fkey";

-- AlterTable
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL,
ADD CONSTRAINT "BoxAlbum_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL,
ADD CONSTRAINT "BoxArtist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL,
ADD CONSTRAINT "BoxPlaylist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL,
ADD CONSTRAINT "BoxTrack_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "BoxSubsectionItem";

-- CreateTable
CREATE TABLE "BoxSubsectionTrack" (
    "boxTrackId" UUID NOT NULL,
    "subsectionId" INTEGER NOT NULL,
    "note" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BoxSubsectionTrack_pkey" PRIMARY KEY ("boxTrackId","subsectionId")
);

-- CreateTable
CREATE TABLE "BoxSubsectionAlbum" (
    "boxAlbumId" UUID NOT NULL,
    "subsectionId" INTEGER NOT NULL,
    "note" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BoxSubsectionAlbum_pkey" PRIMARY KEY ("boxAlbumId","subsectionId")
);

-- CreateTable
CREATE TABLE "BoxSubsectionArtist" (
    "boxArtistId" UUID NOT NULL,
    "subsectionId" INTEGER NOT NULL,
    "note" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BoxSubsectionArtist_pkey" PRIMARY KEY ("boxArtistId","subsectionId")
);

-- CreateTable
CREATE TABLE "BoxSubsectionPlaylist" (
    "boxPlaylistId" UUID NOT NULL,
    "subsectionId" INTEGER NOT NULL,
    "note" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BoxSubsectionPlaylist_pkey" PRIMARY KEY ("boxPlaylistId","subsectionId")
);

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_boxTrackId_fkey" FOREIGN KEY ("boxTrackId") REFERENCES "BoxTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_boxAlbumId_fkey" FOREIGN KEY ("boxAlbumId") REFERENCES "BoxAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_boxArtistId_fkey" FOREIGN KEY ("boxArtistId") REFERENCES "BoxArtist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_boxPlaylistId_fkey" FOREIGN KEY ("boxPlaylistId") REFERENCES "BoxPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
