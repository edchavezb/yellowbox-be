/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `album_id` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `album_type` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_id` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_uri` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_url` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `total_tracks` on the `Album` table. All the data in the column will be lost.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artist_id` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_id` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_uri` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_url` on the `Artist` table. All the data in the column will be lost.
  - The primary key for the `Box` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `folder_id` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `folder_position` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Box` table. All the data in the column will be lost.
  - The primary key for the `BoxAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `album_id` on the `BoxAlbum` table. All the data in the column will be lost.
  - You are about to drop the column `box_id` on the `BoxAlbum` table. All the data in the column will be lost.
  - The primary key for the `BoxArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artist_id` on the `BoxArtist` table. All the data in the column will be lost.
  - You are about to drop the column `box_id` on the `BoxArtist` table. All the data in the column will be lost.
  - The primary key for the `BoxPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `BoxPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `playlist_id` on the `BoxPlaylist` table. All the data in the column will be lost.
  - The primary key for the `BoxSectionSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `display_grouping` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `display_subsections` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `is_visible` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `primary_sorting` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `secondary_sorting` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `section_settings_id` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `sorting_order` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `BoxSubsection` table. All the data in the column will be lost.
  - You are about to drop the column `item_type` on the `BoxSubsection` table. All the data in the column will be lost.
  - You are about to drop the column `subsection_id` on the `BoxSubsection` table. All the data in the column will be lost.
  - You are about to drop the column `subsection_name` on the `BoxSubsection` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsectionAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `album_id` on the `BoxSubsectionAlbum` table. All the data in the column will be lost.
  - You are about to drop the column `box_subsection_id` on the `BoxSubsectionAlbum` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsectionArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artist_id` on the `BoxSubsectionArtist` table. All the data in the column will be lost.
  - You are about to drop the column `box_subsection_id` on the `BoxSubsectionArtist` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsectionPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_subsection_id` on the `BoxSubsectionPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `playlist_id` on the `BoxSubsectionPlaylist` table. All the data in the column will be lost.
  - The primary key for the `BoxSubsectionTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_subsection_id` on the `BoxSubsectionTrack` table. All the data in the column will be lost.
  - You are about to drop the column `track_id` on the `BoxSubsectionTrack` table. All the data in the column will be lost.
  - The primary key for the `BoxTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `BoxTrack` table. All the data in the column will be lost.
  - You are about to drop the column `track_id` on the `BoxTrack` table. All the data in the column will be lost.
  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creator_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `folder_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Folder` table. All the data in the column will be lost.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `owner_name` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `owner_uri` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `playlist_id` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_id` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_uri` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_url` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `total_tracks` on the `Playlist` table. All the data in the column will be lost.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `album_id` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `album_name` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `duration_ms` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_id` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_uri` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_url` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `track_id` on the `Track` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firebase_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linked_services` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserAccountManagementData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `account_management_id` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `account_tier` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `show_tutorial` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `sign_up_date` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - The primary key for the `UserBilling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stripe_customer_id` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_product_id` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_status` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `user_billing_id` on the `UserBilling` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserBilling` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[boxId]` on the table `BoxSectionSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firebaseId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserAccountManagementData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserBilling` will be added. If there are existing duplicate values, this will fail.
  - The required column `albumId` was added to the `Album` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `albumType` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUri` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUrl` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTracks` to the `Album` table without a default value. This is not possible if the table is not empty.
  - The required column `artistId` was added to the `Artist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `spotifyId` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUri` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUrl` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - The required column `boxId` was added to the `Box` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `creatorId` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumId` to the `BoxAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `BoxArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistId` to the `BoxPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayGrouping` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displaySubsections` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVisible` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primarySorting` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondarySorting` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortingOrder` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxSubsection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemType` to the `BoxSubsection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subsectionName` to the `BoxSubsection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumId` to the `BoxSubsectionAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxSubsectionId` to the `BoxSubsectionAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `BoxSubsectionArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxSubsectionId` to the `BoxSubsectionArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxSubsectionId` to the `BoxSubsectionPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistId` to the `BoxSubsectionPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxSubsectionId` to the `BoxSubsectionTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `BoxSubsectionTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxId` to the `BoxTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `BoxTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - The required column `folderId` was added to the `Folder` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `isPublic` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerUri` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - The required column `playlistId` was added to the `Playlist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `spotifyId` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUri` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUrl` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTracks` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumId` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumName` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMs` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUri` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyUrl` to the `Track` table without a default value. This is not possible if the table is not empty.
  - The required column `trackId` was added to the `Track` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `firebaseId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedServices` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `accountManagementId` was added to the `UserAccountManagementData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `UserAccountManagementData` table without a default value. This is not possible if the table is not empty.
  - The required column `userBillingId` was added to the `UserBilling` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `UserBilling` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_album_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSectionSettings" DROP CONSTRAINT "BoxSectionSettings_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsection" DROP CONSTRAINT "BoxSubsection_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_album_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_box_subsection_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_box_subsection_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_box_subsection_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_box_subsection_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_track_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_box_id_fkey";

-- DropForeignKey
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_track_id_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAccountManagementData" DROP CONSTRAINT "UserAccountManagementData_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBilling" DROP CONSTRAINT "UserBilling_user_id_fkey";

-- DropIndex
DROP INDEX "BoxSectionSettings_box_id_key";

-- DropIndex
DROP INDEX "User_firebase_id_key";

-- DropIndex
DROP INDEX "UserAccountManagementData_user_id_key";

-- DropIndex
DROP INDEX "UserBilling_user_id_key";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "album_id",
DROP COLUMN "album_type",
DROP COLUMN "release_date",
DROP COLUMN "spotify_id",
DROP COLUMN "spotify_uri",
DROP COLUMN "spotify_url",
DROP COLUMN "total_tracks",
ADD COLUMN     "albumId" UUID NOT NULL,
ADD COLUMN     "albumType" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TEXT NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL,
ADD COLUMN     "spotifyUri" TEXT NOT NULL,
ADD COLUMN     "spotifyUrl" TEXT NOT NULL,
ADD COLUMN     "totalTracks" INTEGER NOT NULL,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("albumId");

-- AlterTable
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_pkey",
DROP COLUMN "artist_id",
DROP COLUMN "spotify_id",
DROP COLUMN "spotify_uri",
DROP COLUMN "spotify_url",
ADD COLUMN     "artistId" UUID NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL,
ADD COLUMN     "spotifyUri" TEXT NOT NULL,
ADD COLUMN     "spotifyUrl" TEXT NOT NULL,
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("artistId");

-- AlterTable
ALTER TABLE "Box" DROP CONSTRAINT "Box_pkey",
DROP COLUMN "box_id",
DROP COLUMN "created_at",
DROP COLUMN "creator_id",
DROP COLUMN "folder_id",
DROP COLUMN "folder_position",
DROP COLUMN "is_deleted",
DROP COLUMN "is_public",
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" UUID NOT NULL,
ADD COLUMN     "folderId" UUID,
ADD COLUMN     "folderPosition" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD CONSTRAINT "Box_pkey" PRIMARY KEY ("boxId");

-- AlterTable
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_pkey",
DROP COLUMN "album_id",
DROP COLUMN "box_id",
ADD COLUMN     "albumId" UUID NOT NULL,
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "BoxAlbum_pkey" PRIMARY KEY ("albumId", "boxId");

-- AlterTable
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_pkey",
DROP COLUMN "artist_id",
DROP COLUMN "box_id",
ADD COLUMN     "artistId" UUID NOT NULL,
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "BoxArtist_pkey" PRIMARY KEY ("artistId", "boxId");

-- AlterTable
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_pkey",
DROP COLUMN "box_id",
DROP COLUMN "playlist_id",
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "playlistId" UUID NOT NULL,
ADD CONSTRAINT "BoxPlaylist_pkey" PRIMARY KEY ("playlistId", "boxId");

-- AlterTable
ALTER TABLE "BoxSectionSettings" DROP CONSTRAINT "BoxSectionSettings_pkey",
DROP COLUMN "box_id",
DROP COLUMN "display_grouping",
DROP COLUMN "display_subsections",
DROP COLUMN "is_visible",
DROP COLUMN "primary_sorting",
DROP COLUMN "secondary_sorting",
DROP COLUMN "section_settings_id",
DROP COLUMN "sorting_order",
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "displayGrouping" BOOLEAN NOT NULL,
ADD COLUMN     "displaySubsections" BOOLEAN NOT NULL,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL,
ADD COLUMN     "primarySorting" TEXT NOT NULL,
ADD COLUMN     "secondarySorting" TEXT NOT NULL,
ADD COLUMN     "sectionSettingsId" SERIAL NOT NULL,
ADD COLUMN     "sortingOrder" TEXT NOT NULL,
ADD CONSTRAINT "BoxSectionSettings_pkey" PRIMARY KEY ("sectionSettingsId");

-- AlterTable
ALTER TABLE "BoxSubsection" DROP CONSTRAINT "BoxSubsection_pkey",
DROP COLUMN "box_id",
DROP COLUMN "item_type",
DROP COLUMN "subsection_id",
DROP COLUMN "subsection_name",
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "itemType" TEXT NOT NULL,
ADD COLUMN     "subsectionId" SERIAL NOT NULL,
ADD COLUMN     "subsectionName" TEXT NOT NULL,
ADD CONSTRAINT "BoxSubsection_pkey" PRIMARY KEY ("subsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_pkey",
DROP COLUMN "album_id",
DROP COLUMN "box_subsection_id",
ADD COLUMN     "albumId" UUID NOT NULL,
ADD COLUMN     "boxSubsectionId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "BoxSubsectionAlbum_pkey" PRIMARY KEY ("albumId", "boxSubsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_pkey",
DROP COLUMN "artist_id",
DROP COLUMN "box_subsection_id",
ADD COLUMN     "artistId" UUID NOT NULL,
ADD COLUMN     "boxSubsectionId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "BoxSubsectionArtist_pkey" PRIMARY KEY ("artistId", "boxSubsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_pkey",
DROP COLUMN "box_subsection_id",
DROP COLUMN "playlist_id",
ADD COLUMN     "boxSubsectionId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "playlistId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionPlaylist_pkey" PRIMARY KEY ("playlistId", "boxSubsectionId");

-- AlterTable
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_pkey",
DROP COLUMN "box_subsection_id",
DROP COLUMN "track_id",
ADD COLUMN     "boxSubsectionId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trackId" UUID NOT NULL,
ADD CONSTRAINT "BoxSubsectionTrack_pkey" PRIMARY KEY ("trackId", "boxSubsectionId");

-- AlterTable
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_pkey",
DROP COLUMN "box_id",
DROP COLUMN "track_id",
ADD COLUMN     "boxId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trackId" UUID NOT NULL,
ADD CONSTRAINT "BoxTrack_pkey" PRIMARY KEY ("trackId", "boxId");

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
DROP COLUMN "creator_id",
DROP COLUMN "folder_id",
DROP COLUMN "is_public",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" UUID NOT NULL,
ADD COLUMN     "folderId" UUID NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("folderId");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "owner_name",
DROP COLUMN "owner_uri",
DROP COLUMN "playlist_id",
DROP COLUMN "spotify_id",
DROP COLUMN "spotify_uri",
DROP COLUMN "spotify_url",
DROP COLUMN "total_tracks",
ADD COLUMN     "ownerName" TEXT NOT NULL,
ADD COLUMN     "ownerUri" TEXT NOT NULL,
ADD COLUMN     "playlistId" UUID NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL,
ADD COLUMN     "spotifyUri" TEXT NOT NULL,
ADD COLUMN     "spotifyUrl" TEXT NOT NULL,
ADD COLUMN     "totalTracks" INTEGER NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlistId");

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
DROP COLUMN "album_id",
DROP COLUMN "album_name",
DROP COLUMN "duration_ms",
DROP COLUMN "spotify_id",
DROP COLUMN "spotify_uri",
DROP COLUMN "spotify_url",
DROP COLUMN "track_id",
ADD COLUMN     "albumId" TEXT NOT NULL,
ADD COLUMN     "albumName" TEXT NOT NULL,
ADD COLUMN     "durationMs" INTEGER NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL,
ADD COLUMN     "spotifyUri" TEXT NOT NULL,
ADD COLUMN     "spotifyUrl" TEXT NOT NULL,
ADD COLUMN     "trackId" UUID NOT NULL,
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("trackId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "firebase_id",
DROP COLUMN "first_name",
DROP COLUMN "image_url",
DROP COLUMN "last_name",
DROP COLUMN "linked_services",
DROP COLUMN "user_id",
ADD COLUMN     "firebaseId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "linkedServices" JSONB NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UserAccountManagementData" DROP CONSTRAINT "UserAccountManagementData_pkey",
DROP COLUMN "account_management_id",
DROP COLUMN "account_tier",
DROP COLUMN "email_verified",
DROP COLUMN "show_tutorial",
DROP COLUMN "sign_up_date",
DROP COLUMN "user_id",
ADD COLUMN     "accountManagementId" UUID NOT NULL,
ADD COLUMN     "accountTier" "AccountTiers" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showTutorial" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "signUpDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "UserAccountManagementData_pkey" PRIMARY KEY ("accountManagementId");

-- AlterTable
ALTER TABLE "UserBilling" DROP CONSTRAINT "UserBilling_pkey",
DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_price_id",
DROP COLUMN "stripe_product_id",
DROP COLUMN "stripe_subscription_id",
DROP COLUMN "stripe_subscription_status",
DROP COLUMN "user_billing_id",
DROP COLUMN "user_id",
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "stripeSubscriptionStatus" TEXT,
ADD COLUMN     "userBillingId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "UserBilling_pkey" PRIMARY KEY ("userBillingId");

-- CreateIndex
CREATE UNIQUE INDEX "BoxSectionSettings_boxId_key" ON "BoxSectionSettings"("boxId");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccountManagementData_userId_key" ON "UserAccountManagementData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBilling_userId_key" ON "UserBilling"("userId");

-- AddForeignKey
ALTER TABLE "UserAccountManagementData" ADD CONSTRAINT "UserAccountManagementData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBilling" ADD CONSTRAINT "UserBilling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("folderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("playlistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSectionSettings" ADD CONSTRAINT "BoxSectionSettings_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsection" ADD CONSTRAINT "BoxSubsection_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("playlistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE RESTRICT ON UPDATE CASCADE;
