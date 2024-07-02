import UserNotFoundError from '../errors/UserNotFoundError';

export default class UserService {
  #UserModel;

  constructor(UserModel) {
    this.#UserModel = UserModel;
  }

  async fetchById(userId) {
    const user = await this.#UserModel.findById(userId);

    if (!user) UserNotFoundError(userId);

    return this.#UserModel.findById(userId);
  }

  async fetchAll() {
    return this.#UserModel.find();
  }
}
