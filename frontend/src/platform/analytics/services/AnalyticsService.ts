import { IAnalyticsService } from "./IAnalyticsService";
import { IAnalyticsProvider } from "../providers/IAnalyticsProvider";
import { IJobQueue } from "@/platform/operations";
import { logger } from "@/platform/observability";

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private provider: IAnalyticsProvider,
    private jobQueue: IJobQueue
  ) {
    this.registerWorkers();
  }

  private registerWorkers() {
    this.jobQueue.registerHandler?.("analytics:track", async (payload: unknown) => {
      const data = payload as { event: string; properties?: Record<string, unknown> };
      await this.provider.track(data.event, data.properties);
    });

    this.jobQueue.registerHandler?.("analytics:identify", async (payload: unknown) => {
      const data = payload as { userId: string; traits?: Record<string, unknown> };
      await this.provider.identify(data.userId, data.traits);
    });
  }

  async track(event: string, properties?: Record<string, unknown>, async: boolean = true): Promise<void> {
    try {
      if (async) {
        await this.jobQueue.enqueue("analytics:track", { event, properties });
      } else {
        await this.provider.track(event, properties);
      }
    } catch (error) {
      logger.error(error, { action: "ANALYTICS_TRACK_ERROR", event });
    }
  }

  async identify(userId: string, traits?: Record<string, unknown>, async: boolean = true): Promise<void> {
    try {
      if (async) {
        await this.jobQueue.enqueue("analytics:identify", { userId, traits });
      } else {
        await this.provider.identify(userId, traits);
      }
    } catch (error) {
      logger.error(error, { action: "ANALYTICS_IDENTIFY_ERROR", userId });
    }
  }
}
