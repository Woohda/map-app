/*
  Warnings:

  - A unique constraint covering the columns `[uploadthingKey]` on the table `location_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadthingKey` to the `location_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "location_images" ADD COLUMN     "uploadthingKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "location_images_uploadthingKey_key" ON "location_images"("uploadthingKey");
