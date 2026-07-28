import { INotificationService, NotificationChannel, NotificationPayload } from "./INotificationService";
import { ITemplateEngine } from "../templates/ITemplateEngine";
import { IEmailProvider } from "../providers/IEmailProvider";
import { IJobQueue } from "@/platform/operations";
import { logger } from "@/platform/observability";

export class NotificationService implements INotificationService {
  constructor(
    private templateEngine: ITemplateEngine,
    private emailProvider: IEmailProvider,
    private jobQueue: IJobQueue
  ) {
    this.registerWorkers();
  }

  private registerWorkers() {
    this.jobQueue.registerHandler?.("notification:send_email", async (payload: unknown) => {
      const data = payload as { to: string; subject: string; body: string };
      await this.emailProvider.sendEmail(data.to, data.subject, data.body);
    });
  }

  async notify(userId: string, templateId: string, payload: NotificationPayload, channels: NotificationChannel[]): Promise<void> {
    try {
      const content = await this.templateEngine.render(templateId, payload as Record<string, unknown>);

      if (channels.includes("email") && payload.toEmail) {
        // Enqueue email sending to Operations Capability
        await this.jobQueue.enqueue("notification:send_email", {
          to: payload.toEmail,
          subject: payload.subject || "Notificação ObraFácil",
          body: content,
        });
      }

      if (channels.includes("in_app")) {
        // Future In-App notification using Data Foundation
        logger.debug("In-App notification deferred (Aguardando Data Foundation)", { userId, content });
      }
    } catch (error) {
      logger.error(error, {
        action: "NOTIFICATION_DISPATCH_FAILED",
        userId,
        templateId,
      });
      throw error; // Let domain decide if it breaks or not
    }
  }
}
