/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `List` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "List" ALTER COLUMN "telefone" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "List_id_key" ON "List"("id");
