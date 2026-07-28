export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorContext {
  [key: string]: unknown;
}

export abstract class BaseError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext;

  constructor(
    name: string,
    message: string,
    isOperational: boolean = true,
    severity: ErrorSeverity = "medium",
    context?: ErrorContext
  ) {
    super(message);
    this.name = name;
    this.isOperational = isOperational;
    this.severity = severity;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BusinessError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super("BusinessError", message, true, "medium", context);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super("ValidationError", message, true, "low", context);
  }
}

export class InfrastructureError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super("InfrastructureError", message, true, "high", context);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Não autorizado", context?: ErrorContext) {
    super("UnauthorizedError", message, true, "low", context);
  }
}

export class UnexpectedError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super("UnexpectedError", message, false, "critical", context);
  }
}

export class RateLimitExceededError extends BaseError {
  constructor(message: string = "Muitas requisições. Tente novamente mais tarde.", context?: ErrorContext) {
    super("RateLimitExceededError", message, true, "low", context);
  }
}
