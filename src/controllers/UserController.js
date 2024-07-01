export default class UserController {
  #UserService;

  constructor(UserService) {
    this.#UserService = UserService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchById = this.#fetchById.bind(this);
  }

  async #fetchAll() {
    return this.#UserService.fetchAll();
  }

  async #fetchById(walletId) {
    return this.#UserService.fetchById(walletId);
  }
}
