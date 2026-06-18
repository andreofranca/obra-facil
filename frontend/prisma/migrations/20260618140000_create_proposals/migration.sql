-- CreateEnum
CREATE TYPE "PropostaStatus" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA');

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "prazoDias" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" "PropostaStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposals_solicitacaoId_idx" ON "proposals"("solicitacaoId");

-- CreateIndex
CREATE INDEX "proposals_profissionalId_idx" ON "proposals"("profissionalId");

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "service_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
