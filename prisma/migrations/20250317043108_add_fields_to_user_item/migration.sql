-- AlterTable
ALTER TABLE "UserItem" ADD COLUMN     "isPlayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastPlayedAt" TIMESTAMP(3),
ADD COLUMN     "lastQueuedAt" TIMESTAMP(3);
