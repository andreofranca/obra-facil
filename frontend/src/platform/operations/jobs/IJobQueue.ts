export interface JobOptions {
  delayMs?: number;
  attempts?: number;
  priority?: "low" | "normal" | "high";
}

export interface IJobQueue {
  enqueue<T>(taskName: string, payload: T, options?: JobOptions): Promise<string>;
  schedule<T>(taskName: string, payload: T, runAt: Date): Promise<string>;
  registerHandler?<T>(taskName: string, handler: (payload: T) => Promise<void>): void;
}
