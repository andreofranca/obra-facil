import { InMemoryCacheProvider, TokenBucketRateLimiter, createWithRateLimit } from "@/platform/performance";

// Singleton provider setup
const cacheProvider = new InMemoryCacheProvider();
const tokenBucketLimiter = new TokenBucketRateLimiter(cacheProvider);

// Exportar o decorador de rate limit
export const withRateLimit = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true' 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? (handler: any) => handler 
  : createWithRateLimit(tokenBucketLimiter);
