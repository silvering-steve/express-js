import { ApolloError } from 'apollo-server-errors';

export default class UserNotFoundError extends ApolloError {
  constructor(userId) {
    super(`User with id:${userId} not found`, 'NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'User Not Found Error' });
  }
}
