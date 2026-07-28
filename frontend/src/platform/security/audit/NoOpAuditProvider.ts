import { AuditEvent, IAuditProvider } from "./IAuditProvider";

export class NoOpAuditProvider implements IAuditProvider {
  logEvent(_event: AuditEvent): void | Promise<void> {
    // No-op implementation for now.
    // In the future, this could push events to a specialized audit log system,
    // SIEM, or database table.
  }
}
