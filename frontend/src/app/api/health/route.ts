import { NextRequest, NextResponse } from "next/server";
import { withObservability } from "@/platform/observability/middleware/withObservability";

async function healthHandler(_request: NextRequest) {
  const payload = {
    status: "up",
    endpoint: "health",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime ? process.uptime() : null,
  };

  return NextResponse.json(payload, { status: 200 });
}

export const GET = withObservability(healthHandler);
