/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `BoxSectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Folder` table. All the data in the column will be lost.
  - The `account_tier` column on the `UserAccountManagementData` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `created_at` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_public` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_visible` to the `BoxSectionSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_public` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountTiers" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "Box" DROP COLUMN "isDeleted",
DROP COLUMN "public",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "folder_position" INTEGER,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "is_public" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "BoxSectionSettings" DROP COLUMN "visibility",
ADD COLUMN     "is_visible" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "public",
ADD COLUMN     "is_public" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserAccountManagementData" DROP COLUMN "account_tier",
ADD COLUMN     "account_tier" "AccountTiers" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "sign_up_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "email_verified" SET DEFAULT false,
ALTER COLUMN "show_tutorial" SET DEFAULT true;
