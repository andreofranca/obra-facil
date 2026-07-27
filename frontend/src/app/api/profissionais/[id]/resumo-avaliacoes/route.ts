import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { logger } from "@/lib/logger";
import { RatingService } from "@/domain/RatingService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const reqLogger = logger.withRequest(request);
  try {
    const { id } = await context.params;
    
    const resumo = await RatingService.getProfissionalReputation(id);

    return apiSuccess(resumo);
  } catch (error) {
    reqLogger.error(error);
    return apiError("Erro ao buscar resumo das avaliações", 500);
  }
}
