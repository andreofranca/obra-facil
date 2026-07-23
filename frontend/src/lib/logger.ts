import { NextRequest } from "next/server";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface LoggerOptions {
  requestId?: string;
  correlationId?: string;
}

/**
 * Interface desenhada para ser futuramente substituível 
 * de forma transparente por bibliotecas maduras como o Pino.
 */
class Logger {
  private baseContext: Record<string, unknown> = {};

  constructor(context: Record<string, unknown> = {}) {
    this.baseContext = context;
  }

  child(bindings: Record<string, unknown>): Logger {
    return new Logger({ ...this.baseContext, ...bindings });
  }

  withRequest(request: NextRequest): Logger {
    const requestId =
      request.headers.get("x-request-id") || crypto.randomUUID();
    const correlationId =
      request.headers.get("x-correlation-id") || requestId;

    return this.child({ requestId, correlationId });
  }

  private write(
    level: LogLevel,
    msgOrError: string | Error | unknown,
    args?: Record<string, unknown>
  ) {
    let message = "";
    let errorStack: string | undefined = undefined;

    if (msgOrError instanceof Error) {
      message = msgOrError.message;
      errorStack = msgOrError.stack; // Preservar stack trace completo
    } else if (typeof msgOrError === "string") {
      message = msgOrError;
    } else {
      message = String(msgOrError);
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...this.baseContext,
      ...args,
    };

    if (errorStack) {
      entry.errorStack = errorStack;
    }

    // Output JSON estruturado nativo, sem bibliotecas externas
    const output = JSON.stringify(entry);

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

  debug(message: string, args?: Record<string, unknown>) {
    this.write("debug", message, args);
  }

  info(message: string, args?: Record<string, unknown>) {
    this.write("info", message, args);
  }

  warn(message: string, args?: Record<string, unknown>) {
    this.write("warn", message, args);
  }

  error(errorOrMessage: Error | string | unknown, args?: Record<string, unknown>) {
    this.write("error", errorOrMessage, args);
  }
}

export const logger = new Logger();
