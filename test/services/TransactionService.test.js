import TransactionService from '../../src/services/TransactionService';
import BadRequestError from '../../src/errors/BadRequestError';

let transaction;
let transactionModel;
let walletService;

beforeEach(() => {
  const wallet = { balance: 0 };
  walletService = {
    updateWallet: jest.fn().mockResolvedValue(wallet)
  };

  transaction = {
    amount: '10000',
    description: 'Something',
    type: 'OUT',
    wallet,
    created_at: Date.now()
  };

  transactionModel = {
    find: jest.fn().mockResolvedValue(transaction),
    create: jest.fn().mockResolvedValue(transaction)
  };
});

describe('TransactionService', () => {
  describe('^fetchByWalletIdAndFilter', () => {
    it('should return the transaction data that filtered using walletId', async () => {
      const walletAndFilterData = {
        walletId: 'Something'
      };
      const transactionService = new TransactionService(
        transactionModel,
        walletService
      );

      const actualResult =
        await transactionService.fetchByWalletIdAndFilter(walletAndFilterData);

      expect(JSON.stringify(actualResult)).toEqual(JSON.stringify(transaction));
    });
  });

  describe('^createTransaction', () => {
    it('should return the transaction data that filtered using walletId', async () => {
      const createTransactionData = {
        walletId: '60d5ec49f0b92a3e9c1e7290',
        amount: '10000',
        type: 'IN',
        description: '-'
      };
      const transactionService = new TransactionService(
        transactionModel,
        walletService
      );

      const actualResult = await transactionService.createTransaction(
        createTransactionData
      );

      expect(JSON.stringify(actualResult)).toEqual(JSON.stringify(transaction));
    });

    it(
      'should return error validation when some of the data have incorrect' +
        ' value',
      async () => {
        const createTransactionData = {
          walletId: 'asd',
          amount: '10000',
          type: 'IN',
          description: '-'
        };
        const transactionService = new TransactionService(
          transactionModel,
          walletService
        );

        const actualResult = async () =>
          transactionService.createTransaction(createTransactionData);

        await expect(actualResult).rejects.toThrow(BadRequestError);
      }
    );
  });
});
