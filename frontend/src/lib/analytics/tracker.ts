import { AnalyticsService, ConsoleAnalyticsProvider } from "@/platform/analytics";
import { SyncJobQueue } from "@/platform/operations/jobs/SyncJobQueue";

// Singleton provider setup
const provider = new ConsoleAnalyticsProvider();
const jobQueue = new SyncJobQueue();

export const tracker = new AnalyticsService(provider, jobQueue);
