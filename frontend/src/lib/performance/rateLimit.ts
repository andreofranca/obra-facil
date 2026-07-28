import { InMemoryCacheProvider, TokenBucketRateLimiter, createWithRateLimit } from "@/platform/performance";

// Singleton provider setup
const cacheProvider = new InMemoryCacheProvider();
const tokenBucketLimiter = new TokenBucketRateLimiter(cacheProvider);

// Exportar o decorador de rate limit
export const withRateLimit = createWithRateLimit(tokenBucketLimiter);
