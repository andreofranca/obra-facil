-- CreateEnum
CREATE TYPE "public"."ProfissionalPlanoStatus" AS ENUM ('ATIVO', 'INATIVO', 'CANCELADO', 'EXPIRADO');

-- CreateTable
CREATE TABLE "public"."plans" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(65,30) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."professional_plans" (
    "id" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "status" "public"."ProfissionalPlanoStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "professional_plans_profissionalId_idx" ON "public"."professional_plans"("profissionalId");

-- CreateIndex
CREATE INDEX "professional_plans_planoId_idx" ON "public"."professional_plans"("planoId");

-- CreateIndex
CREATE INDEX "professional_plans_status_idx" ON "public"."professional_plans"("status");

-- CreateIndex
CREATE INDEX "professional_plans_dataFim_idx" ON "public"."professional_plans"("dataFim");

-- AddForeignKey
ALTER TABLE "public"."professional_plans" ADD CONSTRAINT "professional_plans_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professional_plans" ADD CONSTRAINT "professional_plans_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "public"."plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
