export interface IMaintenanceService {
  isMaintenanceMode(): Promise<boolean> | boolean;
  getSystemStatus(): Promise<"operational" | "maintenance" | "degraded"> | "operational" | "maintenance" | "degraded";
}
