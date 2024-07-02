import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { ApolloServer, gql } from 'apollo-server-express';
import { DateTimeResolver } from 'graphql-scalars';
import { model } from 'mongoose';

import WalletSchema from './schemas/WalletSchema';
import WalletService from './services/WalletService';
import WalletController from './controllers/WalletController';
import UserSchema from './schemas/UserSchema';
import UserService from './services/UserService';
import UserController from './controllers/UserController';
import TransactionSchema from './schemas/TransactionSchema';
import TransactionService from './services/TransactionService';
import TransactionController from './controllers/TransactionController';

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

  return { walletService, userService, transactionService };
};

const createController = (services) => {
  const { walletService, userService, transactionService } = services;

  return {
    walletController: new WalletController(walletService),
    userController: new UserController(userService),
    transactionController: new TransactionController(transactionService)
  };
};

const initializeDependencies = () => {
  const models = createModels();
  const services = createServices(models);
  app.locals.controllers = createController(services);
};

const main = async () => {
  initializeDependencies();

  // Import typeDefs
  const schemaPath = path.join(__dirname, 'schema.graphql');
  const typeDefs = gql(fs.readFileSync(schemaPath, { encoding: 'utf-8' }));

  // Define Resolver
  const resolvers = {
    Date: DateTimeResolver,
    Query: {
      healthCheck: () => 'I Love You',

      getUsers: app.locals.controllers.userController.fetchAll,
      getUser: (_, args) =>
        app.locals.controllers.userController.fetchById(args),
      getTransactionsByWallet: (_, args) =>
        app.locals.controllers.transactionController.fetchByWalletIdAndFilter(
          args
        )
    },
    Mutation: {
      createUser: (_, args) =>
        app.locals.controllers.userController.createUser(args),
      updateUser: (_, args) =>
        app.locals.controllers.userController.updateUser(args),

      createTransaction: (_, args) =>
        app.locals.controllers.transactionController.createTransaction(args)
    },
    User: {
      wallet: (parent) =>
        app.locals.controllers.walletController.fetchById(parent.wallet)
    }
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  server.applyMiddleware({ app });
};

main();

export default app;
