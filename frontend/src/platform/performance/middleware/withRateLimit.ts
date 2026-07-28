import { NextRequest, NextResponse } from "next/server";
import { IRateLimiter } from "../rate-limit";
import { logger, RateLimitExceededError } from "@/platform/observability";

export type RateLimitOptions = {
  limit: number;
  windowSeconds: number;
  keyPrefix?: string;
};

export function createWithRateLimit(rateLimiter: IRateLimiter) {
  return function withRateLimit(
    handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse> | NextResponse,
    options: RateLimitOptions
  ) {
    return async (req: NextRequest, ...args: unknown[]) => {
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
      const key = `${options.keyPrefix || "global"}:${ip}`;

      const result = await rateLimiter.consume(key, options.limit, options.windowSeconds);

      if (!result.allowed) {
        logger.warn("Rate limit excedido", {
          action: "RATE_LIMIT_EXCEEDED",
          ip,
          path: req.nextUrl.pathname,
          limit: options.limit,
        });

        throw new RateLimitExceededError();
      }

      const response = await handler(req, ...args);
      
      // Inject rate limit headers
      response.headers.set("X-RateLimit-Limit", options.limit.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", result.resetTimeMs.toString());

      return response;
    };
  };
}
