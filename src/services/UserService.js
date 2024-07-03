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

  async fetchWallet(walletId) {
    return this.#WalletService.fetchById(walletId);
  }

  async createUser(inputUserData) {
    const wallet = await this.#WalletService.createWallet();
    const { error } = userBodyValidation.validate(inputUserData);
    if (error) throw new BadRequestError(error);
    const { birthdate, ...rest } = inputUserData;
    return this.#UserModel.create({
      ...rest,
      birthdate: new Date(birthdate),
      wallet
    });
  }

  async updateUser(userId, inputUserData) {
    const { error: inputDataError } =
      userBodyValidation.validate(inputUserData);
    if (inputDataError) throw new BadRequestError(inputDataError);
    const user = await this.#UserModel.findByIdAndUpdate(
      userId,
      inputUserData,
      {
        new: true
      }
    );
    if (!user) throw new UserNotFoundError(userId);
    return user;
  }
}
