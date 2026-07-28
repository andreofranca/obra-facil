export interface AuditEvent {
  action: string;
  principalId?: string;
  resourceId?: string;
  status: "SUCCESS" | "FAILURE";
  reason?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface IAuditProvider {
  logEvent(event: AuditEvent): void | Promise<void>;
}
