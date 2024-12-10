/*
  Warnings:

  - You are about to drop the column `ownerUri` on the `Playlist` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "ownerUri",
ADD COLUMN     "ownerId" TEXT NOT NULL;
