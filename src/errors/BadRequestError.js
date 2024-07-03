import { ApolloError } from 'apollo-server-errors';

export default class BadRequestError extends ApolloError {
  constructor(message) {
    super(message, 'BAD_USER_INPUT');

    Object.defineProperty(this, 'name', { value: 'Bad Request' });
  }
}
