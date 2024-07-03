const initializeUserResolvers = (userController) => {
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
      wallet: (parent) => userController.fetchWallet(parent.wallet)
    }
  };
};

export default initializeUserResolvers;
