import { 
  PaymentProvider, 
  ChargeParams, 
  ChargeResult, 
  RefundResult, 
  TransferParams, 
  TransferResult 
} from '../provider';

export class MockPaymentProvider implements PaymentProvider {
  
  async createCharge(params: ChargeParams): Promise<ChargeResult> {
    // Simula uma resposta do gateway de pagamento
    const isSuccess = params.sourceId !== 'fail-token';
    
    return {
      providerId: `mock_charge_${Date.now()}`,
      status: isSuccess ? 'COMPLETED' : 'FAILED',
      rawResponse: { message: isSuccess ? 'Success' : 'Declined by mock provider' }
    };
  }

  async processRefund(chargeId: string, amount: number): Promise<RefundResult> {
    return {
      providerId: `mock_refund_${Date.now()}`,
      status: 'COMPLETED',
      rawResponse: { message: 'Refund successful', chargeId, amount }
    };
  }

  async createTransfer(params: TransferParams): Promise<TransferResult> {
    return {
      providerId: `mock_transfer_${Date.now()}`,
      status: 'COMPLETED',
      rawResponse: { message: 'Transfer successful' }
    };
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    // Simula validação (em prod, usaria a chave secreta e hash do payload)
    return signature === 'mock-valid-signature';
  }
}
