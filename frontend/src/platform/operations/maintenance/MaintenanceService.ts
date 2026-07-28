import { IMaintenanceService } from "./IMaintenanceService";
import { IFeatureFlagProvider } from "../features";

export class MaintenanceService implements IMaintenanceService {
  constructor(private featureFlagProvider: IFeatureFlagProvider) {}

  async isMaintenanceMode(): Promise<boolean> {
    return await this.featureFlagProvider.isEnabled("maintenance_mode");
  }

  async getSystemStatus(): Promise<"operational" | "maintenance" | "degraded"> {
    if (await this.isMaintenanceMode()) {
      return "maintenance";
    }
    return "operational";
  }
}
