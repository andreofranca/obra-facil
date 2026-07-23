-- CreateIndex
CREATE INDEX "professionals_avaliacaoMedia_idx" ON "public"."professionals"("avaliacaoMedia" DESC);

-- CreateIndex
CREATE INDEX "ratings_profissionalId_idx" ON "public"."ratings"("profissionalId");

-- CreateIndex
CREATE INDEX "service_request_messages_solicitacaoId_idx" ON "public"."service_request_messages"("solicitacaoId");

-- CreateIndex
CREATE INDEX "service_requests_clienteId_idx" ON "public"."service_requests"("clienteId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "public"."service_requests"("status");

-- CreateIndex
CREATE INDEX "services_categoriaId_idx" ON "public"."services"("categoriaId");

-- CreateIndex
CREATE INDEX "services_profissionalId_idx" ON "public"."services"("profissionalId");
