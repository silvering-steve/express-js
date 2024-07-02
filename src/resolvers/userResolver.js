const initializeUserResolvers = (userController, walletController) => {
  return {
    Query: {
      getUsers: userController.fetchAll,
      getUserById: (_, args) => userController.fetchById(args)
    },
    Mutation: {
      createUser: (_, args) => userController.createUser(args),
      updateUser: (_, args) => userController.updateUser(args)
    },
    User: {
      wallet: (parent) => walletController.fetchById(parent.wallet)
    }
  };
};

export default initializeUserResolvers;
