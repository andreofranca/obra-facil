import { ITemplateEngine } from "./ITemplateEngine";

export class SimpleTemplateEngine implements ITemplateEngine {
  private templates: Map<string, string>;

  constructor(initialTemplates?: Record<string, string>) {
    this.templates = new Map(Object.entries(initialTemplates || {}));
  }

  render(templateId: string, payload: Record<string, unknown>): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template [${templateId}] não encontrado.`);
    }

    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      const value = payload[key];
      return value !== undefined ? String(value) : match;
    });
  }

  registerTemplate(templateId: string, content: string) {
    this.templates.set(templateId, content);
  }
}
