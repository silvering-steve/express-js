import WalletService from '../../src/services/WalletService';
import WalletNotFoundError from '../../src/errors/WalletNotFoundError';
import BalanceNotEnoughError from '../../src/errors/BalanceNotEnoughError';

let wallet;
let walletModel;

beforeEach(() => {
  wallet = {
    balance: 100000,
    updateBalance: jest.fn().mockImplementation((type, amount) => {
      if (type === 'IN') wallet.balance += amount;
      if (type === 'OUT') wallet.balance -= amount;

      if (wallet.balance < 0) throw new BalanceNotEnoughError(amount);
      return wallet;
    }),
    save: jest.fn().mockResolvedValue()
  };

  walletModel = {
    findById: jest.fn().mockResolvedValue(wallet),
    create: jest.fn().mockResolvedValue(wallet)
  };
});

describe('WalletService', () => {
  describe('^fetchById', () => {
    const walletId = '1234';

    it('should return the correct wallet by given id', async () => {
      const walletService = new WalletService(walletModel);

      const actualResult = await walletService.fetchById(walletId);

      expect(actualResult).toEqual(wallet);
    });

    it('should throw error when given the wrong id', async () => {
      walletModel.findById = jest.fn().mockResolvedValue(null);
      const walletService = new WalletService(walletModel);

      const actualResult = async () => {
        await walletService.fetchById(walletId);
      };

      await expect(actualResult).rejects.toThrow(WalletNotFoundError);
    });
  });

  describe('^createWallet', () => {
    it('should create new wallet', async () => {
      const walletService = new WalletService(walletModel);

      const actualResult = await walletService.createWallet();

      expect(actualResult).toEqual(wallet);
    });
  });

  describe('^updateBalance', () => {
    const walletId = '1234';

    it('should increase the wallet balance by the amount given', async () => {
      const depositAmount = 200000;
      const transactionType = 'IN';
      const walletService = new WalletService(walletModel);

      const actualResult = await walletService.updateWallet(
        walletId,
        depositAmount,
        transactionType
      );

      expect(actualResult).toEqual(wallet);
    });

    it(
      'should throw error when trying to decrease the balance but does not' +
        ' have that much money',
      async () => {
        const depositAmount = 200000;
        const transactionType = 'OUT';
        const walletService = new WalletService(walletModel);

        const actualResult = async () => {
          await walletService.updateWallet(
            walletId,
            depositAmount,
            transactionType
          );
        };

        await expect(actualResult).rejects.toThrow(BalanceNotEnoughError);
      }
    );
  });
});
