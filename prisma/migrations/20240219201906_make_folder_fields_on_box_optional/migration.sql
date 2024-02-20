-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_folder_id_fkey";

-- AlterTable
ALTER TABLE "Box" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("folder_id") ON DELETE SET NULL ON UPDATE CASCADE;
