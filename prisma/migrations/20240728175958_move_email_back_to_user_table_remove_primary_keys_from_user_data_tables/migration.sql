/*
  Warnings:

  - The primary key for the `UserAccountManagementData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountManagementId` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `UserAccountManagementData` table. All the data in the column will be lost.
  - The primary key for the `UserBilling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userBillingId` on the `UserBilling` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAccountManagementData_email_key";

-- DropIndex
DROP INDEX "UserAccountManagementData_userId_key";

-- DropIndex
DROP INDEX "UserBilling_userId_key";

-- DropIndex
DROP INDEX "UserSpotifyAccount_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserAccountManagementData" DROP CONSTRAINT "UserAccountManagementData_pkey",
DROP COLUMN "accountManagementId",
DROP COLUMN "email",
ADD CONSTRAINT "UserAccountManagementData_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UserBilling" DROP CONSTRAINT "UserBilling_pkey",
DROP COLUMN "userBillingId",
ADD CONSTRAINT "UserBilling_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UserSpotifyAccount" ADD CONSTRAINT "UserSpotifyAccount_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
