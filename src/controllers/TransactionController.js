export default class TransactionController {
  #TransactionService;

  constructor(TransactionService) {
    this.#TransactionService = TransactionService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchByWalletIdAndFilter = this.#fetchByWalletIdAndFilter.bind(this);
    this.createTransaction = this.#createTransaction.bind(this);
  }

  async #fetchAll() {
    return this.#TransactionService.fetchAll();
  }

  async #fetchByWalletIdAndFilter(args) {
    const { walletId, description = '', greaterThan = 0 } = args;

    return this.#TransactionService.fetchByWalletIdAndFilter(
      walletId,
      description,
      greaterThan
    );
  }

  async #createTransaction(args) {
    const { walletId, amount, description, type } = args.createTransactionData;

    return this.#TransactionService.createTransaction(
      walletId,
      amount,
      description,
      type
    );
  }
}
