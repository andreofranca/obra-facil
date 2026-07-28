export interface ICacheProvider {
  get<T>(key: string): Promise<T | null> | (T | null);
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> | void;
  delete(key: string): Promise<void> | void;
  increment(key: string, amount?: number, ttlSeconds?: number): Promise<number> | number;
}
