import { IEmailProvider } from "./IEmailProvider";
import { logger } from "@/platform/observability";

export class ConsoleEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    logger.info("MOCK_EMAIL_DISPATCH", {
      action: "EMAIL_SENT",
      to,
      subject,
      bodyPreview: body.substring(0, 100),
    });
  }
}
