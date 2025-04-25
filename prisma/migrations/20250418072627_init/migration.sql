/*
  Warnings:

  - A unique constraint covering the columns `[email,org_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_email_org_id_key` ON `User`(`email`, `org_id`);
