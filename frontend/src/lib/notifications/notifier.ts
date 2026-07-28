import { SimpleTemplateEngine, ConsoleEmailProvider, NotificationService } from "@/platform/notifications";
import { SyncJobQueue } from "@/platform/operations/jobs/SyncJobQueue";

// Singleton provider setup
const templateEngine = new SimpleTemplateEngine({
  "welcome_email": "Olá {{name}}, bem-vindo(a) ao ObraFácil!",
  "new_proposal": "Olá, você recebeu uma nova proposta no valor de {{amount}} para a solicitação {{requestId}}."
});

const emailProvider = new ConsoleEmailProvider();

// Para simplificação de IoC, injetaremos diretamente uma fila local
// O correto seria recuperar a fila do container de DI (Operations)
const jobQueue = new SyncJobQueue();

export const notifier = new NotificationService(templateEngine, emailProvider, jobQueue);
