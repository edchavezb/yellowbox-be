-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "BoxAlbum" DROP CONSTRAINT "BoxAlbum_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxArtist" DROP CONSTRAINT "BoxArtist_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxPlaylist" DROP CONSTRAINT "BoxPlaylist_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSectionSettings" DROP CONSTRAINT "BoxSectionSettings_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsection" DROP CONSTRAINT "BoxSubsection_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionAlbum" DROP CONSTRAINT "BoxSubsectionAlbum_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionArtist" DROP CONSTRAINT "BoxSubsectionArtist_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionPlaylist" DROP CONSTRAINT "BoxSubsectionPlaylist_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxSubsectionTrack" DROP CONSTRAINT "BoxSubsectionTrack_boxSubsectionId_fkey";

-- DropForeignKey
ALTER TABLE "BoxTrack" DROP CONSTRAINT "BoxTrack_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccountManagementData" DROP CONSTRAINT "UserAccountManagementData_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBilling" DROP CONSTRAINT "UserBilling_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserAccountManagementData" ADD CONSTRAINT "UserAccountManagementData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBilling" ADD CONSTRAINT "UserBilling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSectionSettings" ADD CONSTRAINT "BoxSectionSettings_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsection" ADD CONSTRAINT "BoxSubsection_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_boxSubsectionId_fkey" FOREIGN KEY ("boxSubsectionId") REFERENCES "BoxSubsection"("subsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
