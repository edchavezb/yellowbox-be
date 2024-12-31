/*
  Warnings:

  - You are about to drop the column `linkedServices` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "linkedServices";

-- CreateTable
CREATE TABLE "UserSpotifyAccount" (
    "userId" UUID NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSpotifyAccount_userId_key" ON "UserSpotifyAccount"("userId");

-- AddForeignKey
ALTER TABLE "UserSpotifyAccount" ADD CONSTRAINT "UserSpotifyAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
