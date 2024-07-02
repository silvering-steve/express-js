const initializeTransactionResolvers = (transactionController) => {
  return {
    Query: {
      getTransactionsByWallet: (args) =>
        transactionController.fetchByWalletIdAndFilter(args)
    },
    Mutation: {
      createTransaction: (args) => transactionController.createTransaction(args)
    }
  };
};

export default initializeTransactionResolvers;
