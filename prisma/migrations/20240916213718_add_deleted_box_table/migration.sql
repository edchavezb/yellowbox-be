/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Box` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "position" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DeletedBox" (
    "id" SERIAL NOT NULL,
    "boxData" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "movedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedBox_pkey" PRIMARY KEY ("id")
);
