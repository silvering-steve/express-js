import WalletNotFoundError from '../errors/WalletNotFoundError';

export default class WalletService {
  #WalletModel;

  constructor(WalletModel) {
    this.#WalletModel = WalletModel;
  }

  async fetchById(walletId) {
    const wallet = await this.#WalletModel.findById(walletId);

    if (!wallet) throw new WalletNotFoundError(walletId);

    return wallet;
  }

  async createWallet() {
    return this.#WalletModel.create({ balance: 0 });
  }

  async updateWallet(walletId, amount, type) {
    const wallet = await this.fetchById(walletId);
    const updatedWallet = await wallet.updateBalance(
      type,
      parseInt(amount, 10)
    );

    updatedWallet.save();
    return updatedWallet;
  }
}
