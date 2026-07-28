export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
}

export interface IRateLimiter {
  consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> | RateLimitResult;
}
