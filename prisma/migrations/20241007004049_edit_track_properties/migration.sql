/*
  Warnings:

  - You are about to drop the column `durationMs` on the `Track` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "durationMs",
ADD COLUMN     "duration" INTEGER NOT NULL;
