export interface ChargeParams {
  amount: number;
  currency?: string;
  sourceId: string; // token do cartão, etc.
  description?: string;
  metadata?: Record<string, any>;
  referenceId?: string; // ID da solicitacao/proposta no nosso sistema
}

export interface ChargeResult {
  providerId: string;
  status: 'PENDING' | 'AUTHORIZED' | 'COMPLETED' | 'FAILED';
  rawResponse: any;
}

export interface RefundResult {
  providerId: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  rawResponse: any;
}

export interface TransferParams {
  amount: number;
  currency?: string;
  recipientId: string; // ID da conta do recebedor no provider
  metadata?: Record<string, any>;
}

export interface TransferResult {
  providerId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  rawResponse: any;
}

export interface PaymentProvider {
  createCharge(params: ChargeParams): Promise<ChargeResult>;
  processRefund(chargeId: string, amount: number): Promise<RefundResult>;
  createTransfer(params: TransferParams): Promise<TransferResult>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
}
