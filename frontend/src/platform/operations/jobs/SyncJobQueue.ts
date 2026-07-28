import { IJobQueue, JobOptions } from "./IJobQueue";
import { logger } from "@/platform/observability";

/**
 * Uma implementação síncrona/in-memory para o MVP.
 * Resolve as tarefas despachando-as para processamento após o fluxo atual (setTimeout).
 * NÃO deve ser utilizada em produção pesada, mas resolve a dependência no estágio atual.
 */
export class SyncJobQueue implements IJobQueue {
  private handlers: Map<string, (payload: unknown) => Promise<void>> = new Map();

  registerHandler<T>(taskName: string, handler: (payload: T) => Promise<void>) {
    this.handlers.set(taskName, handler as (payload: unknown) => Promise<void>);
  }

  async enqueue<T>(taskName: string, payload: T, options?: JobOptions): Promise<string> {
    const jobId = Math.random().toString(36).substring(7);
    
    setTimeout(async () => {
      try {
        const handler = this.handlers.get(taskName);
        if (handler) {
          await handler(payload);
          logger.debug(`Job ${taskName} (${jobId}) processado com sucesso.`, { action: "JOB_SUCCESS", taskName, jobId });
        } else {
          logger.warn(`Handler não encontrado para o job ${taskName}.`, { action: "JOB_MISSING_HANDLER", taskName, jobId });
        }
      } catch (error) {
        logger.error(error, { message: `Falha ao processar job ${taskName} (${jobId}).`, action: "JOB_FAILURE", taskName, jobId });
      }
    }, options?.delayMs || 0);

    return jobId;
  }

  async schedule<T>(taskName: string, payload: T, runAt: Date): Promise<string> {
    const delayMs = Math.max(0, runAt.getTime() - Date.now());
    return this.enqueue(taskName, payload, { delayMs });
  }
}
