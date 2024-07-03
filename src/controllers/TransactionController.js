export default class TransactionController {
  #TransactionService;

  constructor(TransactionService) {
    this.#TransactionService = TransactionService;
    this.fetchByWalletIdAndFilter = this.#fetchByWalletIdAndFilter.bind(this);
    this.createTransaction = this.#createTransaction.bind(this);
  }

  async #fetchByWalletIdAndFilter(args) {
    return this.#TransactionService.fetchByWalletIdAndFilter(args);
  }

  async #createTransaction(args) {
    const { createTransactionData } = args;

    return this.#TransactionService.createTransaction(createTransactionData);
  }
}
