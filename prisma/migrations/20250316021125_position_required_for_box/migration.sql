/*
  Warnings:

  - Made the column `position` on table `Box` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Box" ALTER COLUMN "position" SET NOT NULL;
