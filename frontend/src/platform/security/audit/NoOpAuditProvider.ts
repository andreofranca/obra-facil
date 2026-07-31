import { AuditEvent, IAuditProvider } from "./IAuditProvider";

export class NoOpAuditProvider implements IAuditProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logEvent(_event: AuditEvent): void | Promise<void> {
    // No-op implementation for now.
    // In the future, this could push events to a specialized audit log system,
    // SIEM, or database table.
  }
}
