/*
  Warnings:

  - You are about to drop the column `sizez` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sizez",
ADD COLUMN     "sizes" TEXT[];
