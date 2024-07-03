const transactionTypeDefs = `
scalar Date

enum TransactionType {
    IN
    OUT
}

type Transaction {
    id: ID!
    wallet: Wallet!
    amount: Int!
    type: TransactionType!
    created_at: Date!
    description: String
}

input CreateTransactionData {
    walletId: ID!
    amount: String!
    type: TransactionType!
    description: String
}`;

export default transactionTypeDefs;
