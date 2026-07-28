import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContextData {
  correlationId?: string;
  requestId?: string;
  userId?: string;
  tenantId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  requestStart?: number;
}

const contextStorage = new AsyncLocalStorage<RequestContextData>();

export class RequestContext {
  static run<R>(data: RequestContextData, callback: () => R): R {
    return contextStorage.run(data, callback);
  }

  static get(): RequestContextData | undefined {
    return contextStorage.getStore();
  }

  static getCorrelationId(): string | undefined {
    return this.get()?.correlationId;
  }

  static update(data: Partial<RequestContextData>): void {
    const store = contextStorage.getStore();
    if (store) {
      Object.assign(store, data);
    }
  }
}

import { setLoggerContextProvider } from "../logger/ConsoleLogger";
setLoggerContextProvider(() => RequestContext.get());
