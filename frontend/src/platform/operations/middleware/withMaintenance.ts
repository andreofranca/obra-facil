import { NextRequest, NextResponse } from "next/server";
import { IMaintenanceService } from "../maintenance";
import { logger } from "@/platform/observability";

export function createWithMaintenance(maintenanceService: IMaintenanceService) {
  return function withMaintenance(
    handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse> | NextResponse
  ) {
    return async (req: NextRequest, ...args: unknown[]) => {
      const isMaintenance = await maintenanceService.isMaintenanceMode();

      if (isMaintenance) {
        logger.warn("Requisição bloqueada por modo de manutenção", {
          action: "MAINTENANCE_MODE_BLOCKED",
          path: req.nextUrl.pathname,
        });

        return NextResponse.json(
          { error: "O sistema está em manutenção no momento. Tente novamente mais tarde." },
          { status: 503, headers: { "Retry-After": "3600" } }
        );
      }

      return handler(req, ...args);
    };
  };
}
