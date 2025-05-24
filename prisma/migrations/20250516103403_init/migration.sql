-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "telefone" INTEGER NOT NULL,
    "describe" TEXT,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);
