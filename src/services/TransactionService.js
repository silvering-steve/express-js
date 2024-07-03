import transactionBodyValidation from '../validation/TransactionValidation';
import BadRequestError from '../errors/BadRequestError';

export default class TransactionService {
  #TransactionModel;

  #WalletService;

  constructor(TransactionModel, WalletService) {
    this.#TransactionModel = TransactionModel;
    this.#WalletService = WalletService;
  }

  async fetchByWalletIdAndFilter(walletAndFilterData) {
    const { walletId, description = '', greaterThan = 0 } = walletAndFilterData;

    return this.#TransactionModel.find({
      wallet: walletId,
      description: { $regex: description, $options: 'i' },
      amount: { $gte: greaterThan }
    });
  }

  async createTransaction(createTransactionData) {
    const { error } = transactionBodyValidation.validate({
      ...createTransactionData
    });
    if (error) throw new BadRequestError(error);
    const { walletId, amount, type, description } = createTransactionData;
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
