export class MaskingService {
  private static sensitiveKeys = new Set([
    "password",
    "token",
    "cookie",
    "key",
    "secret",
    "authorization",
    "credit_card",
    "cpf",
    "apiKey"
  ]);

  public static mask(obj: unknown): unknown {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.mask(item));
    }

    const maskedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (this.isSensitiveKey(key)) {
        maskedObj[key] = "***MASKED***";
      } else if (typeof value === "object" && value !== null) {
        maskedObj[key] = this.mask(value);
      } else {
        maskedObj[key] = value;
      }
    }
    return maskedObj;
  }

  private static isSensitiveKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    for (const sensitive of this.sensitiveKeys) {
      if (lowerKey.includes(sensitive)) {
        return true;
      }
    }
    return false;
  }
}
