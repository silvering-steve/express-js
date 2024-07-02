import WalletNotFoundError from '../errors/WalletNotFoundError';

export default class WalletService {
  #WalletModel;

  constructor(WalletModel) {
    this.#WalletModel = WalletModel;
  }

  async fetchById(walletId) {
    const wallet = await this.#WalletModel.findById(walletId);
    if (!wallet) WalletNotFoundError(walletId);

    return wallet;
  }

  async createWallet() {
    return this.#WalletModel.create({});
  }

  async updateWallet() {}
}
