-- AlterTable
ALTER TABLE "BoxAlbum" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BoxArtist" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BoxPlaylist" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BoxTrack" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserTopAlbum" (
    "topAlbumId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "albumId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTopAlbum_pkey" PRIMARY KEY ("topAlbumId")
);

-- CreateTable
CREATE TABLE "UpdateUserBioAction" (
    "actionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newBioText" TEXT NOT NULL,

    CONSTRAINT "UpdateUserBioAction_pkey" PRIMARY KEY ("actionId")
);

-- CreateTable
CREATE TABLE "UpdateUserImageAction" (
    "actionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newImageUrl" TEXT NOT NULL,

    CONSTRAINT "UpdateUserImageAction_pkey" PRIMARY KEY ("actionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTopAlbum_userId_position_key" ON "UserTopAlbum"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "UserTopAlbum_userId_albumId_key" ON "UserTopAlbum"("userId", "albumId");

-- AddForeignKey
ALTER TABLE "UserTopAlbum" ADD CONSTRAINT "UserTopAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTopAlbum" ADD CONSTRAINT "UserTopAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateUserBioAction" ADD CONSTRAINT "UpdateUserBioAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateUserImageAction" ADD CONSTRAINT "UpdateUserImageAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
