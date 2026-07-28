export interface IAnalyticsService {
  track(event: string, properties?: Record<string, unknown>, async?: boolean): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>, async?: boolean): Promise<void>;
}
