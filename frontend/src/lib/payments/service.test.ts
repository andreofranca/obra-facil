import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentService } from './service';
import { MockPaymentProvider } from './providers/mock';
import { PaymentStatus, TransferStatus } from '@prisma/client';

// Configurando mocks do Prisma
const {
  mockTransactionCreate,
  mockTransactionUpdate,
  mockTransactionFindUnique,
  mockTransferCreate,
  mockTransferUpdate
} = vi.hoisted(() => ({
  mockTransactionCreate: vi.fn(),
  mockTransactionUpdate: vi.fn(),
  mockTransactionFindUnique: vi.fn(),
  mockTransferCreate: vi.fn(),
  mockTransferUpdate: vi.fn(),
}));

vi.mock('@prisma/client', () => {
  return {
    PaymentStatus: {
      PENDING: 'PENDING',
      AUTHORIZED: 'AUTHORIZED',
      COMPLETED: 'COMPLETED',
      FAILED: 'FAILED',
      REFUNDED: 'REFUNDED',
      DISPUTED: 'DISPUTED'
    },
    TransferStatus: {
      PENDING: 'PENDING',
      COMPLETED: 'COMPLETED',
      FAILED: 'FAILED'
    },
    PrismaClient: class {
      transaction = {
        create: mockTransactionCreate,
        update: mockTransactionUpdate,
        findUnique: mockTransactionFindUnique,
      };
      transfer = {
        create: mockTransferCreate,
        update: mockTransferUpdate,
      };
    }
  };
});

describe('PaymentService', () => {
  let provider: MockPaymentProvider;
  let service: PaymentService;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new MockPaymentProvider();
    service = new PaymentService(provider);
  });

  describe('charge', () => {
    it('should create a transaction and process successful charge', async () => {
      mockTransactionCreate.mockResolvedValue({ id: 'txn-123' });
      mockTransactionUpdate.mockResolvedValue({ 
        id: 'txn-123', 
        status: PaymentStatus.COMPLETED 
      });

      const result = await service.charge({
        amount: 100,
        sourceId: 'valid-token',
        referenceId: 'ref-123'
      });

      // 1. Cria a transação como PENDING
      expect(mockTransactionCreate).toHaveBeenCalledWith({
        data: {
          amount: 100,
          currency: 'BRL',
          status: PaymentStatus.PENDING,
          referenceId: 'ref-123'
        }
      });

      // 2. Atualiza como COMPLETED baseada no MockPaymentProvider
      expect(mockTransactionUpdate).toHaveBeenCalledWith({
        where: { id: 'txn-123' },
        data: expect.objectContaining({
          status: PaymentStatus.COMPLETED,
        })
      });

      expect(result.status).toBe(PaymentStatus.COMPLETED);
    });

    it('should handle failed charge from provider', async () => {
      mockTransactionCreate.mockResolvedValue({ id: 'txn-fail' });
      mockTransactionUpdate.mockResolvedValue({ 
        id: 'txn-fail', 
        status: PaymentStatus.FAILED 
      });

      const result = await service.charge({
        amount: 50,
        sourceId: 'fail-token', // mock disparar falha
        referenceId: 'ref-456'
      });

      expect(mockTransactionUpdate).toHaveBeenCalledWith({
        where: { id: 'txn-fail' },
        data: expect.objectContaining({
          status: PaymentStatus.FAILED,
        })
      });

      expect(result.status).toBe(PaymentStatus.FAILED);
    });
  });

  describe('transferToProfissional', () => {
    it('should fail if transaction is not COMPLETED', async () => {
      mockTransactionFindUnique.mockResolvedValue({
        id: 'txn-1',
        status: PaymentStatus.PENDING
      });

      await expect(
        service.transferToProfissional('txn-1', 'prof-123', 80)
      ).rejects.toThrow('Cannot transfer funds from an incomplete transaction');
      
      expect(mockTransferCreate).not.toHaveBeenCalled();
    });

    it('should process transfer successfully', async () => {
      mockTransactionFindUnique.mockResolvedValue({
        id: 'txn-ok',
        status: PaymentStatus.COMPLETED
      });

      mockTransferCreate.mockResolvedValue({ id: 'trf-1' });
      mockTransferUpdate.mockResolvedValue({ id: 'trf-1', status: TransferStatus.COMPLETED });

      const result = await service.transferToProfissional('txn-ok', 'prof-123', 80);

      expect(mockTransferCreate).toHaveBeenCalledWith({
        data: {
          transactionId: 'txn-ok',
          recipientId: 'prof-123',
          amount: 80,
          status: TransferStatus.PENDING
        }
      });

      expect(mockTransferUpdate).toHaveBeenCalledWith({
        where: { id: 'trf-1' },
        data: expect.objectContaining({
          status: TransferStatus.COMPLETED
        })
      });

      expect(result.status).toBe(TransferStatus.COMPLETED);
    });
  });
});
