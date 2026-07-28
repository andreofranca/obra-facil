import { NextRequest } from "next/server";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  correlationId?: string;
  module?: string;
  action?: string;
  duration?: number;
  message: string;
  errorStack?: string;
  [key: string]: unknown;
}

export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(errorOrMessage: Error | string | unknown, context?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): ILogger;
  withRequest(request: NextRequest): ILogger;
}
