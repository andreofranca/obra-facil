import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  
  const payload = {
    status: "up",
    endpoint: "health",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime ? process.uptime() : null, // process.uptime() is available in Node.js runtime, but might be null in Edge
  };

  reqLogger.debug("Health probe OK");

  return NextResponse.json(payload, { status: 200 });
}
