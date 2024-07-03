import transactionTypeDefs from './transactionTypeDefs';
import walletTypeDefs from './walletTypeDefs';
import userTypeDefs from './userTypeDefs';

const typeDefs = `
${transactionTypeDefs}
${walletTypeDefs}
${userTypeDefs}

type Query {
    healthCheck: String!
    getUsers: [User!]!
    getUserById(userId: ID!): User
    getTransactionsByWallet(walletId: ID!, description: String, greaterThan: Int): [Transaction]!
}

type Mutation {
    createUser(inputUserData: InputUserData!): User!
    updateUser(userId: ID!, inputUserData: InputUserData!): User!
    createTransaction(createTransactionData: CreateTransactionData!): Transaction!
}`;

export default typeDefs;
