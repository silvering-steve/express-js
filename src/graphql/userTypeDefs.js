const userTypeDefs = `
type User {
    id: ID!
    address: String
    birthdate: Date
    created_at: Date
    name: String!
    phone: String!
    wallet: Wallet!
}

input InputUserData {
    name: String!
    address: String!
    phone: String!
    birthdate: String!
}`;

export default userTypeDefs;
