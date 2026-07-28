export interface ITemplateEngine {
  render(templateId: string, payload: Record<string, unknown>): Promise<string> | string;
}
