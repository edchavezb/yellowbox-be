/*
  Warnings:

  - The `sortingOrder` column on the `BoxSectionSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SortingOrder" AS ENUM ('ASCENDING', 'DESCENDING');

-- AlterTable
ALTER TABLE "BoxSectionSettings" ALTER COLUMN "view" SET DEFAULT 'grid',
ALTER COLUMN "displayGrouping" SET DEFAULT false,
ALTER COLUMN "displaySubsections" SET DEFAULT false,
ALTER COLUMN "isVisible" SET DEFAULT true,
ALTER COLUMN "primarySorting" SET DEFAULT 'custom',
ALTER COLUMN "secondarySorting" SET DEFAULT 'none',
DROP COLUMN "sortingOrder",
ADD COLUMN     "sortingOrder" "SortingOrder" NOT NULL DEFAULT 'ASCENDING';
