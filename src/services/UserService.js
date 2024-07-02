import UserNotFoundError from '../errors/UserNotFoundError';
import {
  userBodyValidation,
  userIdValidation
} from '../validation/UserValidation';
import BadRequestError from '../errors/BadRequestError';

export default class UserService {
  #UserModel;

  #WalletService;

  constructor(UserModel, WalletService) {
    this.#UserModel = UserModel;
    this.#WalletService = WalletService;
  }

  async fetchById(userId) {
    const { error } = userIdValidation.validate({ userId });
    if (error) throw new UserNotFoundError(userId);

    const user = await this.#UserModel.findById(userId);
    if (!user) throw new UserNotFoundError(userId);

    return this.#UserModel.findById(userId);
  }

  async fetchAll() {
    return this.#UserModel.find();
  }

  async createUser(name, address, phone, birthdate) {
    const wallet = await this.#WalletService.createWallet();
    const { error } = userBodyValidation.validate({
      name,
      address,
      phone,
      birthdate
    });
    if (error) throw new BadRequestError(error);
    return this.#UserModel.create({
      name,
      address,
      phone,
      birthdate: new Date(birthdate),
      wallet
    });
  }

  async updateUser(userId, name, address, phone, birthdate) {
    const { error } = userBodyValidation.validate({
      name,
      address,
      phone,
      birthdate
    });
    if (error) throw new BadRequestError(error);
    const user = await this.fetchById(userId);
    user.name = name;
    user.address = address;
    user.phone = phone;
    user.birthdate = birthdate;
    return user.save();
  }
}
