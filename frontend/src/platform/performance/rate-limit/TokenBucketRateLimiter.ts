import { ICacheProvider } from "../cache/ICacheProvider";
import { IRateLimiter, RateLimitResult } from "./IRateLimiter";

export class TokenBucketRateLimiter implements IRateLimiter {
  constructor(private cacheProvider: ICacheProvider) {}

  async consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const cacheKey = `rate_limit:${key}`;
    const resetTimeKey = `${cacheKey}:reset`;

    let resetTimeMs = await this.cacheProvider.get<number>(resetTimeKey);
    
    if (!resetTimeMs) {
      resetTimeMs = Date.now() + windowSeconds * 1000;
      await this.cacheProvider.set(resetTimeKey, resetTimeMs, windowSeconds);
    }

    const currentCount = await this.cacheProvider.increment(cacheKey, 1, windowSeconds);

    return {
      allowed: currentCount <= limit,
      remaining: Math.max(0, limit - currentCount),
      resetTimeMs,
    };
  }
}
