const initializeTransactionResolvers = (transactionController) => {
  return {
    Query: {
      getTransactionsByWallet: (_, args) =>
        transactionController.fetchByWalletIdAndFilter(args)
    },
    Mutation: {
      createTransaction: (_, args) =>
        transactionController.createTransaction(args)
    }
  };
};

export default initializeTransactionResolvers;
