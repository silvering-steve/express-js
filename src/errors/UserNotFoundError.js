import { ApolloError } from 'apollo-server-errors';

export default class UserNotFoundError extends ApolloError {
  constructor(userId) {
    super(`User with id:${userId} not found`, '404');

    Object.defineProperty(this, 'name', { value: 'User Not Found Error' });
  }
}
