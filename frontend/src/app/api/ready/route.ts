import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { InfrastructureError } from "@/platform/observability";
import { withObservability } from "@/platform/observability/middleware/withObservability";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function readyHandler(_request: NextRequest) {
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
    await prisma.$queryRaw`SELECT 1`;
    payload.checks.database = "up";

    const requiredEnvs = ["DATABASE_URL"];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      payload.checks.env = "down";
      throw new InfrastructureError(`Missing mandatory environment variables: ${missingEnvs.join(", ")}`);
    } else {
      payload.checks.env = "up";
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    payload.status = "down";
    payload.error = error instanceof Error ? error.message : "Unknown error during readiness check";
    
    if (payload.checks.database === "unknown") payload.checks.database = "down";
    
    // Throwing an InfrastructureError lets the withObservability wrapper log it correctly
    throw new InfrastructureError("Readiness check failed", { payload, originalError: error });
  }
}

export const GET = withObservability(readyHandler);
