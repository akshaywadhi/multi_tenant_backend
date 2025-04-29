/*
  Warnings:

  - Added the required column `fileUrl` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL;
