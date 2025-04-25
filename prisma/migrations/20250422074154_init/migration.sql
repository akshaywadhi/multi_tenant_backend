-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_org_id_fkey` FOREIGN KEY (`org_id`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
