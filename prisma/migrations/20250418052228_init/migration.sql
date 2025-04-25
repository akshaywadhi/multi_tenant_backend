/*
  Warnings:

  - You are about to drop the column `password_hash` on the `admin` table. All the data in the column will be lost.
  - Added the required column `password` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `password_hash`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;
