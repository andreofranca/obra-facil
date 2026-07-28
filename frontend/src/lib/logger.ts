// Arquivo mantido para garantir retrocompatibilidade total da arquitetura antiga.
// Todas as responsabilidades de logging foram movidas para a capability de Platform Observability.
import { logger as platformLogger, LogLevel, LogEntry, ILogger } from "@/platform/observability";

export type { LogLevel, LogEntry, ILogger as Logger };

export const logger = platformLogger;
