export default class WalletController {
  #WalletService;

  constructor(WalletService) {
    this.#WalletService = WalletService;
    this.fetchById = this.#fetchById.bind(this);
    this.updateWallet = this.#updateWallet.bind(this);
  }

  async #fetchById(walletId) {
    return this.#WalletService.fetchById(walletId);
  }

  async #updateWallet(args) {
    const { id, amount, type } = args;

    return this.#WalletService.updateWallet(id, amount, type);
  }
}
