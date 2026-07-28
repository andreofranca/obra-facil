export interface ICryptoProvider {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, storedHash: string): Promise<boolean>;
  signPayload(payload: string, secret: string): string;
  verifySignature(payload: string, signature: string, secret: string): boolean;
}
