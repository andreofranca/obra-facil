-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PropostaStatus" ADD VALUE 'CANCELADA';
ALTER TYPE "public"."PropostaStatus" ADD VALUE 'EXPIRADA';

-- AlterEnum
ALTER TYPE "public"."SolicitacaoStatus" ADD VALUE 'AGUARDANDO_CONFIRMACAO_CLIENTE';

-- AlterTable
ALTER TABLE "public"."service_requests" ADD COLUMN     "finishedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."service_request_status_history" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "statusAnterior" "public"."SolicitacaoStatus",
    "novoStatus" "public"."SolicitacaoStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_request_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_request_status_history_solicitacaoId_idx" ON "public"."service_request_status_history"("solicitacaoId");

-- CreateIndex
CREATE INDEX "service_request_status_history_usuarioId_idx" ON "public"."service_request_status_history"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."service_request_status_history" ADD CONSTRAINT "service_request_status_history_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "public"."service_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_request_status_history" ADD CONSTRAINT "service_request_status_history_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
