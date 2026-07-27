/*
  Warnings:

  - You are about to drop the column `avaliacaoMedia` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `totalAvaliacoes` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_profissionalId_fkey";

-- DropIndex
DROP INDEX "public"."professionals_avaliacaoMedia_idx";

-- AlterTable
ALTER TABLE "public"."professionals" DROP COLUMN "avaliacaoMedia",
DROP COLUMN "totalAvaliacoes";

-- DropTable
DROP TABLE "public"."ratings";

-- CreateTable
CREATE TABLE "public"."service_ratings" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_ratings_solicitacaoId_key" ON "public"."service_ratings"("solicitacaoId");

-- CreateIndex
CREATE INDEX "service_ratings_profissionalId_idx" ON "public"."service_ratings"("profissionalId");

-- CreateIndex
CREATE INDEX "service_ratings_clienteId_idx" ON "public"."service_ratings"("clienteId");

-- AddForeignKey
ALTER TABLE "public"."service_ratings" ADD CONSTRAINT "service_ratings_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "public"."service_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_ratings" ADD CONSTRAINT "service_ratings_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_ratings" ADD CONSTRAINT "service_ratings_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
