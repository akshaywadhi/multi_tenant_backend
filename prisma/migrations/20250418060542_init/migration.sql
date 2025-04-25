-- AlterTable
ALTER TABLE `organization` ADD COLUMN `created_by_admin` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_created_by_admin_fkey` FOREIGN KEY (`created_by_admin`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
