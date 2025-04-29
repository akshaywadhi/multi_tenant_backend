/*
  Warnings:

  - Added the required column `fileUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL;
