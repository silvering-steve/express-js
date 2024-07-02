import transactionBodyValidation from '../validation/TransactionValidation';
import BadRequestError from '../errors/BadRequestError';

export default class TransactionService {
  #TransactionModel;

  #WalletService;

  constructor(TransactionModel, WalletService) {
    this.#TransactionModel = TransactionModel;
    this.#WalletService = WalletService;
  }

  async fetchByWalletIdAndFilter(walletId, description = '', greaterThan = 0) {
    return this.#TransactionModel.find({
      wallet: walletId,
      description: { $regex: description, $options: 'i' },
      amount: { $gte: greaterThan }
    });
  }

  async fetchAll() {
    return this.#TransactionModel.find();
  }

  async createTransaction(walletId, amount, description, type) {
    const { error } = transactionBodyValidation.validate({
      walletId,
      amount,
      description,
      type
    });
    if (error) throw new BadRequestError(error);
    const wallet = await this.#WalletService.updateWallet(
      walletId,
      amount,
      type
    );
    return this.#TransactionModel.create({
      amount,
      wallet,
      description,
      type
    });
  }
}
