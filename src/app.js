import express from 'express';

import { ApolloServer } from 'apollo-server-express';
import { model } from 'mongoose';

import WalletSchema from './schemas/WalletSchema';
import WalletService from './services/WalletService';
import UserSchema from './schemas/UserSchema';
import UserService from './services/UserService';
import UserController from './controllers/UserController';
import TransactionSchema from './schemas/TransactionSchema';
import TransactionService from './services/TransactionService';
import TransactionController from './controllers/TransactionController';

import initializeResolvers from './resolvers/rootResolver';
import typeDefs from './graphql/typeDefs';

const app = express();
app.use(express.json());

const createModels = () => {
  return {
    walletModel: model('Wallet', WalletSchema),
    userModel: model('User', UserSchema),
    transactionModel: model('Transaction', TransactionSchema)
  };
};

const createServices = (models) => {
  const { walletModel, userModel, transactionModel } = models;

  const walletService = new WalletService(walletModel);
  const userService = new UserService(userModel, walletService);
  const transactionService = new TransactionService(
    transactionModel,
    walletService
  );

  return { userService, transactionService };
};

const createController = (services) => {
  const { userService, transactionService } = services;

  return {
    userController: new UserController(userService),
    transactionController: new TransactionController(transactionService)
  };
};

const initializeDependencies = () => {
  const models = createModels();
  const services = createServices(models);
  const controllers = createController(services);

  return initializeResolvers(controllers);
};

const main = async () => {
  const resolvers = initializeDependencies();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  server.applyMiddleware({ app });
};

main();

export default app;
