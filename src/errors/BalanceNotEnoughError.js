import { ApolloError } from 'apollo-server-errors';

export default class BalanceNotEnoughError extends ApolloError {
  constructor() {
    super('Balance is not enough', 'BAD_USER_INPUT');

    Object.defineProperty(this, 'name', { value: 'Bad Request' });
  }
}
