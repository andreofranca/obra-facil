import { describe, it, expect } from 'vitest';
import { MockPaymentProvider } from './mock';

describe('MockPaymentProvider', () => {
  const provider = new MockPaymentProvider();

  describe('createCharge', () => {
    it('should return COMPLETED when sourceId is valid', async () => {
      const result = await provider.createCharge({
        amount: 100,
        sourceId: 'valid-token',
        referenceId: 'req-123'
      });

      expect(result.status).toBe('COMPLETED');
      expect(result.providerId).toMatch(/^mock_charge_\d+$/);
      expect(result.rawResponse.message).toBe('Success');
    });

    it('should return FAILED when sourceId is "fail-token"', async () => {
      const result = await provider.createCharge({
        amount: 100,
        sourceId: 'fail-token',
        referenceId: 'req-123'
      });

      expect(result.status).toBe('FAILED');
      expect(result.providerId).toMatch(/^mock_charge_\d+$/);
      expect(result.rawResponse.message).toBe('Declined by mock provider');
    });
  });

  describe('processRefund', () => {
    it('should always return COMPLETED for processRefund', async () => {
      const result = await provider.processRefund('charge-123', 50);

      expect(result.status).toBe('COMPLETED');
      expect(result.providerId).toMatch(/^mock_refund_\d+$/);
      expect(result.rawResponse.chargeId).toBe('charge-123');
      expect(result.rawResponse.amount).toBe(50);
    });
  });

  describe('createTransfer', () => {
    it('should always return COMPLETED for createTransfer', async () => {
      const result = await provider.createTransfer({
        amount: 80,
        recipientId: 'rec-123'
      });

      expect(result.status).toBe('COMPLETED');
      expect(result.providerId).toMatch(/^mock_transfer_\d+$/);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should return true for valid signature', () => {
      const isValid = provider.verifyWebhookSignature({ data: 'any' }, 'mock-valid-signature');
      expect(isValid).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const isValid = provider.verifyWebhookSignature({ data: 'any' }, 'invalid-signature');
      expect(isValid).toBe(false);
    });
  });
});
