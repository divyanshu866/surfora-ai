/*
  Warnings:

  - You are about to drop the `GenerationUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenerationUsage" DROP CONSTRAINT "GenerationUsage_userId_fkey";

-- DropTable
DROP TABLE "GenerationUsage";
