export default class WalletController {
  #WalletService;

  constructor(WalletService) {
    this.#WalletService = WalletService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchById = this.#fetchById.bind(this);
  }

  async #fetchAll() {
    return this.#WalletService.fetchAll();
  }

  async #fetchById(walletId) {
    return this.#WalletService.fetchById(walletId);
  }
}
