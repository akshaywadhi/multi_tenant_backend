/*
  Warnings:

  - You are about to drop the column `created_by` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assigned_to_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_org_id_fkey`;

-- DropIndex
DROP INDEX `Task_assigned_to_fkey` ON `task`;

-- DropIndex
DROP INDEX `Task_created_by_fkey` ON `task`;

-- DropIndex
DROP INDEX `Task_org_id_fkey` ON `task`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `created_by`;

-- DropTable
DROP TABLE `comment`;
