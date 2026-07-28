/**
 * Placeholder para futura integração com OpenTelemetry (OTel).
 * O Tracing distribuído deve iniciar spans ao redor de operações pesadas (ex: chamadas de banco).
 */
export interface ITracer {
  startSpan(name: string): unknown;
  endSpan(span: unknown): void;
}

export class MockTracer implements ITracer {
  startSpan(name: string) {
    return { name, startTime: Date.now() };
  }

  endSpan(_span: unknown): void {
    // Record duration if needed
  }
}

export const tracer: ITracer = new MockTracer();
