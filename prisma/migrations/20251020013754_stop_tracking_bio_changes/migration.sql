/*
  Warnings:

  - You are about to drop the `UpdateUserBioAction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UpdateUserBioAction" DROP CONSTRAINT "UpdateUserBioAction_userId_fkey";

-- DropTable
DROP TABLE "UpdateUserBioAction";
