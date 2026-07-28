export class EdgeSessionDecoder {
  /**
   * Decodes an unverified session payload for Edge Runtime usage (where full crypto may not be available).
   * WARNING: This does NOT verify the signature. Use this only for routing heuristics (e.g. proxy/middleware).
   */
  static decodeUnverifiedPayload<T>(cookieValue: string | undefined): T | null {
    if (!cookieValue) return null;

    try {
      const [payloadBase64] = cookieValue.split(".");
      if (!payloadBase64) return null;

      const decodedPayload = Buffer.from(payloadBase64, "base64url").toString("utf8");
      return JSON.parse(decodedPayload) as T;
    } catch {
      return null;
    }
  }
}
