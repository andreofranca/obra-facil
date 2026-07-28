import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "../context";
import { logger } from "../logger";
import { BaseError, UnexpectedError } from "../errors";
import { metrics } from "../metrics";

type ApiHandler = (req: NextRequest, ...args: unknown[]) => Promise<NextResponse> | NextResponse;

export function withObservability(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ...args: unknown[]) => {
    const requestStart = parseInt(req.headers.get("x-request-start") || Date.now().toString(), 10);
    const correlationId = req.headers.get("x-correlation-id") || crypto.randomUUID();
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const contextData = {
      correlationId,
      requestId,
      requestStart,
      ip,
      userAgent,
      // userId and tenantId should be populated downstream if auth exists
    };

    return RequestContext.run(contextData, async () => {
      const stopTimer = metrics.startTimer("http_request_duration", { path: req.nextUrl.pathname, method: req.method });
      metrics.incrementCounter("http_requests_total", 1, { path: req.nextUrl.pathname, method: req.method });
      
      logger.info(`Request Start: ${req.method} ${req.nextUrl.pathname}`, {
        module: "API_Middleware",
        action: "REQUEST_START",
        path: req.nextUrl.pathname,
        method: req.method
      });

      try {
        const response = await handler(req, ...args);
        
        const duration = Date.now() - requestStart;
        stopTimer();

        logger.info(`Request End: ${req.method} ${req.nextUrl.pathname}`, {
          module: "API_Middleware",
          action: "REQUEST_END",
          path: req.nextUrl.pathname,
          method: req.method,
          status: response.status,
          duration,
        });

        response.headers.set("x-correlation-id", correlationId);
        return response;

      } catch (error) {
        const duration = Date.now() - requestStart;
        stopTimer();

        let handledError: BaseError;
        let status = 500;

        if (error instanceof BaseError) {
          handledError = error;
          if (error.name === "BusinessError") status = 400;
          if (error.name === "ValidationError") status = 400;
          if (error.name === "UnauthorizedError") status = 401;
        } else {
          handledError = new UnexpectedError(error instanceof Error ? error.message : "Unknown error", { originalError: error });
        }

        logger.error(handledError, {
          module: "API_Middleware",
          action: "REQUEST_ERROR",
          path: req.nextUrl.pathname,
          method: req.method,
          status,
          duration,
          errorSeverity: handledError.severity,
          errorContext: handledError.context
        });

        metrics.incrementCounter("http_requests_errors", 1, { path: req.nextUrl.pathname, method: req.method, type: handledError.name });

        return NextResponse.json({
          error: handledError.name,
          message: handledError.message,
          correlationId
        }, { status });
      }
    });
  };
}
