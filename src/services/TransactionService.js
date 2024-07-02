export default class TransactionService {
  #TransactionModel;

  constructor(TransactionModel) {
    this.#TransactionModel = TransactionModel;
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
}
