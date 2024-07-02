import { ApolloError } from 'apollo-server-errors';

export default class BalanceNotEnoughError extends ApolloError {
  constructor() {
    super('Balance is not enough', '400');

    Object.defineProperty(this, 'name', { value: 'Bad Request' });
  }
}
