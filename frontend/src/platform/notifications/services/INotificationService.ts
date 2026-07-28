export type NotificationChannel = "email" | "in_app" | "sms";

export interface NotificationPayload {
  toEmail?: string;
  toPhone?: string;
  subject?: string;
  [key: string]: unknown;
}

export interface INotificationService {
  notify(
    userId: string,
    templateId: string,
    payload: NotificationPayload,
    channels: NotificationChannel[]
  ): Promise<void>;
}
