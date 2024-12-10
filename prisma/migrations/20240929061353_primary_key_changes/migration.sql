/*
  Warnings:

  - The primary key for the `BoxSectionSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sectionSettingsId` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subsectionName` on the `BoxSubsection` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsectionAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BoxSubsectionArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BoxSubsectionPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BoxSubsectionTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `BoxSubsection` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subsectionId` on the `BoxSubsection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subsectionId` on the `BoxSubsectionAlbum` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subsectionId` on the `BoxSubsectionArtist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subsectionId` on the `BoxSubsectionPlaylist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subsectionId` on the `BoxSubsectionTrack` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_subsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_subsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_subsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_subsectionId_fkey";

-- AlterTable
ALTER TABLE "BoxSectionSettings" DROP CONSTRAINT "BoxSectionSettings_pkey",
DROP COLUMN "sectionSettingsId",
ADD CONSTRAINT "BoxSectionSettings_pkey" PRIMARY KEY ("boxId", "type");

-- AlterTable
ALTER TABLE "BoxSubsection" DROP CONSTRAINT "BoxSubsection_pkey",
DROP COLUMN "subsectionName",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "subsectionId",
ADD COLUMN     "subsectionId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsection_pkey" PRIMARY KEY ("subsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_pkey",
DROP COLUMN "subsectionId",
ADD COLUMN     "subsectionId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionAlbum_pkey" PRIMARY KEY ("boxAlbumId", "subsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_pkey",
DROP COLUMN "subsectionId",
ADD COLUMN     "subsectionId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionArtist_pkey" PRIMARY KEY ("boxArtistId", "subsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_pkey",
DROP COLUMN "subsectionId",
ADD COLUMN     "subsectionId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionPlaylist_pkey" PRIMARY KEY ("boxPlaylistId", "subsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_pkey",
DROP COLUMN "subsectionId",
ADD COLUMN     "subsectionId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionTrack_pkey" PRIMARY KEY ("boxTrackId", "subsectionId");

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
