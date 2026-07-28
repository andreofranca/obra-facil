export type HealthStatus = "up" | "down" | "degraded";

export interface HealthCheckResult {
  status: HealthStatus;
  component: string;
  message?: string;
  timestamp: string;
}

export interface IHealthChecker {
  checkHealth(): Promise<HealthCheckResult>;
}

export class DatabaseHealthChecker implements IHealthChecker {
  async checkHealth(): Promise<HealthCheckResult> {
    // Implement database health check logic here
    // In a real scenario, this would inject a Prisma Client instance
    // For platform abstraction, we keep it generalized or inject the dependency.
    return {
      status: "up",
      component: "database",
      timestamp: new Date().toISOString()
    };
  }
}
