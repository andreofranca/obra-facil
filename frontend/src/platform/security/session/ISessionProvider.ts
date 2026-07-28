export interface ISessionProvider {
  createSessionValue<T>(sessionData: T): string;
  parseSessionValue<T>(cookieValue: string | undefined): T | null;
  getSessionSecret(): string;
}
