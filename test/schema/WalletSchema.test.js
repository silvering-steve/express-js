import mongoose from 'mongoose';
import walletSchema from '../../src/schemas/WalletSchema';
import BalanceNotEnoughError from '../../src/errors/BalanceNotEnoughError';

describe('WalletSchema', () => {
  describe('^updateBalance', () => {
    const WalletModel = mongoose.model('Wallet', walletSchema);
    const initialAmount = 20000;
    const depositAmount = 10000;

    let wallet;
    beforeEach(() => {
      wallet = new WalletModel({ balance: initialAmount });
    });

    it('should increase balance when given IN type and the amount', () => {
      const expectedResult = depositAmount + initialAmount;

      wallet.updateBalance('IN', depositAmount);

      const actualBalance = wallet.balance;
      expect(actualBalance).toEqual(expectedResult);
    });

    it('should decrease balance when given OUT type and the amount', () => {
      const withdrawAmount = 10000;
      const expectedResult = initialAmount - withdrawAmount;

      wallet.updateBalance('OUT', withdrawAmount);

      const actualBalance = wallet.balance;
      expect(actualBalance).toEqual(expectedResult);
    });

    it(
      'should throw error wen try to decrease balance but the balance is' +
        ' not enough',
      () => {
        const withdrawAmount = 30000;

        const actualResult = () => {
          wallet.updateBalance('OUT', withdrawAmount);
        };

        expect(actualResult).toThrow(BalanceNotEnoughError);
      }
    );
  });
});
