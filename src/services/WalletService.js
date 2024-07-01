export default class WalletService {
  #WalletModel;

  constructor(WalletModel) {
    this.#WalletModel = WalletModel;
  }

  async fetchById(walletId) {
    return this.#WalletModel.findById(walletId);
  }

  async fetchAll() {
    return this.#WalletModel.find();
  }
}
