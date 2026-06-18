-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN "profissionalId" TEXT;

-- CreateIndex
CREATE INDEX "service_requests_profissionalId_idx" ON "service_requests"("profissionalId");

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
