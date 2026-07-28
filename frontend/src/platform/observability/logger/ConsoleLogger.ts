import { ILogger, LogEntry, LogLevel } from "./ILogger";
import { MaskingService } from "./MaskingService";
import { NextRequest } from "next/server";

export let contextProvider: () => unknown = () => undefined;
export function setLoggerContextProvider(provider: () => unknown) {
  contextProvider = provider;
}

export class ConsoleLogger implements ILogger {
  private baseContext: Record<string, unknown>;

  constructor(context: Record<string, unknown> = {}) {
    this.baseContext = context;
  }

  child(bindings: Record<string, unknown>): ILogger {
    return new ConsoleLogger({ ...this.baseContext, ...bindings });
  }

  withRequest(request: NextRequest): ILogger {
    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
    const correlationId = request.headers.get("x-correlation-id") || requestId;
    return this.child({ requestId, correlationId });
  }

  private write(level: LogLevel, msgOrError: string | Error | unknown, args?: Record<string, unknown>) {
    let message = "";
    let errorStack: string | undefined = undefined;

    if (msgOrError instanceof Error) {
      message = msgOrError.message;
      errorStack = msgOrError.stack;
    } else if (typeof msgOrError === "string") {
      message = msgOrError;
    } else {
      message = String(msgOrError);
    }

    const reqContext = contextProvider() as Record<string, unknown> | undefined;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: (reqContext?.correlationId as string) || (this.baseContext.correlationId as string | undefined),
      ...this.baseContext,
      ...args,
    };

    if (errorStack) {
      entry.errorStack = errorStack;
    }

    const maskedEntry = MaskingService.mask(entry);
    const output = JSON.stringify(maskedEntry);

    switch (level) {
      case "debug":
        console.debug(output);
        break;
      case "info":
        console.info(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "error":
        console.error(output);
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.write("warn", message, context);
  }

  error(errorOrMessage: Error | string | unknown, context?: Record<string, unknown>): void {
    this.write("error", errorOrMessage, context);
  }
}
