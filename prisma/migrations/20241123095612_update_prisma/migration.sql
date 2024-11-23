/*
  Warnings:

  - The `frequency` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('ONCE', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "ReminderFrequency";
