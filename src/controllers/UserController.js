export default class UserController {
  #UserService;

  constructor(UserService) {
    this.#UserService = UserService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchById = this.#fetchById.bind(this);
    this.createUser = this.#createUser.bind(this);
  }

  async #fetchAll() {
    return this.#UserService.fetchAll();
  }

  async #fetchById(args) {
    const { userId } = args;

    return this.#UserService.fetchById(userId);
  }

  async #createUser(args) {
    const { name, address, phone, birthdate } = args.createUserData;

    return this.#UserService.createUser(name, address, phone, birthdate);
  }
}
