import { ApolloError } from 'apollo-server-errors';

export default class BadRequestError extends ApolloError {
  constructor(message) {
    super(message, '400');

    Object.defineProperty(this, 'name', { value: 'Bad Request' });
  }
}
