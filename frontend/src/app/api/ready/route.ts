import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  
  const payload = {
    status: "up",
    endpoint: "ready",
    timestamp: new Date().toISOString(),
    checks: {
      database: "unknown",
      env: "unknown"
    },
    error: null as string | null
  };

  try {
    // 1. Check Database Connectivity
    await prisma.$queryRaw`SELECT 1`;
    payload.checks.database = "up";

    // 2. Check Mandatory Env Variables
    const requiredEnvs = ["DATABASE_URL"];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      payload.checks.env = "down";
      throw new Error(`Missing mandatory environment variables: ${missingEnvs.join(", ")}`);
    } else {
      payload.checks.env = "up";
    }

    reqLogger.debug("Readiness probe OK", { checks: payload.checks });
    return NextResponse.json(payload, { status: 200 });

  } catch (error) {
    reqLogger.error(error, { endpoint: "ready", checks: payload.checks });
    
    payload.status = "down";
    payload.error = error instanceof Error ? error.message : "Unknown error during readiness check";
    
    // Fallback status if env failed but db passed, etc
    if (payload.checks.database === "unknown") payload.checks.database = "down";
    
    return NextResponse.json(payload, { status: 503 });
  }
}
