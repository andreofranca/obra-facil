import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  
  const payload = {
    status: "up",
    endpoint: "live",
    timestamp: new Date().toISOString(),
  };

  reqLogger.debug("Liveness probe OK");

  return NextResponse.json(payload, { status: 200 });
}
