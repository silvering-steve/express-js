export default class UserController {
  #UserService;

  constructor(UserService) {
    this.#UserService = UserService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchById = this.#fetchById.bind(this);
    this.fetchWallet = this.#fetchWallet.bind(this);
    this.createUser = this.#createUser.bind(this);
    this.updateUser = this.#updateUser.bind(this);
  }

  async #fetchAll() {
    return this.#UserService.fetchAll();
  }

  async #fetchById(args) {
    const { userId } = args;

    return this.#UserService.fetchById(userId);
  }

  async #fetchWallet(walletId) {
    return this.#UserService.fetchWallet(walletId);
  }

  async #createUser(args) {
    const { inputUserData } = args;

    return this.#UserService.createUser(inputUserData);
  }

  async #updateUser(args) {
    const { userId, inputUserData } = args;

    return this.#UserService.updateUser(userId, inputUserData);
  }
}
