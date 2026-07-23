-- AlterTable
ALTER TABLE "public"."professionals" ADD COLUMN     "avaliacaoMedia" DECIMAL(65,30) DEFAULT 0.0,
ADD COLUMN     "totalAvaliacoes" INTEGER NOT NULL DEFAULT 0;
