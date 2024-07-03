import { DateTimeResolver } from 'graphql-scalars';
import initializeUserResolvers from './userResolver';
import initializeTransactionResolvers from './transactionResolver';

const initializeRootResolvers = (userResolvers, transactionResolvers) => {
  return {
    Date: DateTimeResolver,
    Query: {
      healthCheck: () => 'I Love You Haruka',
      ...userResolvers.Query,
      ...transactionResolvers.Query
    },
    Mutation: {
      ...userResolvers.Mutation,
      ...transactionResolvers.Mutation
    },
    User: userResolvers.User
  };
};

const initializeResolvers = (controllers) => {
  const { userController, transactionController } = controllers;
  const userResolvers = initializeUserResolvers(userController);
  const transactionResolvers = initializeTransactionResolvers(
    transactionController
  );

  return initializeRootResolvers(userResolvers, transactionResolvers);
};

export default initializeResolvers;
