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

import errorMiddleware from './middlewares/errorMiddleware';

const app = express();
app.use(express.json());

const createModels = () => {
  return {
    walletModel: model('Wallet', WalletSchema),
    userModel: model('User', UserSchema)
  };
};

const createServices = (models) => {
  const { walletModel, userModel } = models;

  const walletService = new WalletService(walletModel);
  const userService = new UserService(userModel);

  return { walletService, userService };
};

const createController = (services) => {
  const { walletService, userService } = services;

  return {
    walletController: new WalletController(walletService),
    userController: new UserController(userService)
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

      getWallets: app.locals.controllers.walletController.fetchAll,
      getUsers: app.locals.controllers.userController.fetchAll
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

app.use(errorMiddleware);

export default app;
