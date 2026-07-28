import { ICacheProvider } from "./ICacheProvider";

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

export class InMemoryCacheProvider implements ICacheProvider {
  private cache: Map<string, CacheItem<unknown>> = new Map();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  increment(key: string, amount: number = 1, ttlSeconds?: number): number {
    const current = this.get<number>(key) || 0;
    const newValue = current + amount;
    this.set(key, newValue, ttlSeconds);
    return newValue;
  }
}
