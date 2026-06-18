-- AlterTable
ALTER TABLE "service_request_messages" ADD COLUMN "usuarioId" TEXT;

-- CreateIndex
CREATE INDEX "service_request_messages_usuarioId_idx" ON "service_request_messages"("usuarioId");

-- AddForeignKey
ALTER TABLE "service_request_messages" ADD CONSTRAINT "service_request_messages_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
