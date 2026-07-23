-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "bairro" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_profissionalId_key" ON "public"."addresses"("profissionalId");

-- CreateIndex
CREATE INDEX "addresses_cidade_idx" ON "public"."addresses"("cidade");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
