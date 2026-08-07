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

      let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const bytes = new Uint8Array(atob(base64).split("").map(c => c.charCodeAt(0)));
      const decodedPayload = new TextDecoder("utf-8").decode(bytes);
      return JSON.parse(decodedPayload) as T;
    } catch {
      return null;
    }
  }
}
