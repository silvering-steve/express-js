export default class UserController {
  #UserService;

  constructor(UserService) {
    this.#UserService = UserService;
    this.fetchAll = this.#fetchAll.bind(this);
    this.fetchById = this.#fetchById.bind(this);
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

  async #createUser(args) {
    const { name, address, phone, birthdate } = args.inputUserData;

    return this.#UserService.createUser(name, address, phone, birthdate);
  }

  async #updateUser(args) {
    const {
      userId,
      inputUserData: { name, address, phone, birthdate }
    } = args;

    return this.#UserService.updateUser(
      userId,
      name,
      address,
      phone,
      birthdate
    );
  }
}
