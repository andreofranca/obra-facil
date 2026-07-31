export interface IMetricsCollector {
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
  recordGauge(name: string, value: number, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;
  startTimer(name: string, tags?: Record<string, string>): () => void;
}

export class MockMetricsCollector implements IMetricsCollector {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  incrementCounter(_name: string, _value = 1, _tags?: Record<string, string>): void {
    // Placeholder for future implementation (e.g. Prometheus)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recordGauge(_name: string, _value: number, _tags?: Record<string, string>): void {
    // Placeholder for future implementation
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recordHistogram(_name: string, _value: number, _tags?: Record<string, string>): void {
    // Placeholder for future implementation
  }

  startTimer(name: string, tags?: Record<string, string>): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.recordHistogram(name, duration, tags);
    };
  }
}

export const metrics: IMetricsCollector = new MockMetricsCollector();
