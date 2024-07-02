import { ApolloError } from 'apollo-server-errors';

export default class WalletNotFoundError extends ApolloError {
  constructor(walletId) {
    super(`Wallet with id:${walletId} not found`, '404');

    Object.defineProperty(this, 'name', { value: 'Wallet Not Found Error' });
  }
}
