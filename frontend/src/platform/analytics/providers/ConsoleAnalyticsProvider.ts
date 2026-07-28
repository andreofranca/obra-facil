import { IAnalyticsProvider } from "./IAnalyticsProvider";
import { logger } from "@/platform/observability";

export class ConsoleAnalyticsProvider implements IAnalyticsProvider {
  async track(event: string, properties?: Record<string, unknown>): Promise<void> {
    logger.info("ANALYTICS_TRACK", {
      action: "ANALYTICS_EVENT",
      event,
      ...properties,
    });
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    logger.info("ANALYTICS_IDENTIFY", {
      action: "ANALYTICS_IDENTIFY",
      userId,
      ...traits,
    });
  }
}
