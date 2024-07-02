export default class WalletController {
  #WalletService;

  constructor(WalletService) {
    this.#WalletService = WalletService;
    this.fetchById = this.#fetchById.bind(this);
  }

  async #fetchById(walletId) {
    return this.#WalletService.fetchById(walletId);
  }
}
