export default class UserService {
  #UserModel;

  constructor(UserModel) {
    this.#UserModel = UserModel;
  }

  async fetchById(userId) {
    return this.#UserModel.findById(userId);
  }

  async fetchAll() {
    return this.#UserModel.find();
  }
}
