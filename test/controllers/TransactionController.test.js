import mongoose from 'mongoose';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

import walletSchema from '../../src/schemas/WalletSchema';
import transactionSchema from '../../src/schemas/TransactionSchema';
import app from '../../src/app';

import 'dotenv/config';

let walletModel;
let transactionModel;

beforeAll(() => {
  mongoose.connect(process.env.DATABASE_TEST_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  walletModel = mongoose.model('Wallet', walletSchema);
  transactionModel = mongoose.model('Transaction', transactionSchema);
});

afterEach(async () => {
  await transactionModel.deleteMany();
  await walletModel.deleteMany();
});

describe('TransactionController', () => {
  describe('/graphql fetchByWalletIdAndFilter', () => {
    it('should return all the transaction with specific walletId', async () => {
      const descriptionFilterValue = '';
      const amountFilterValue = 0;
      const stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: stevenWalletId } = stevenWallet;
      const stevenTransaction = await transactionModel.create({
        amount: 10000,
        wallet: stevenWallet,
        description: 'Something',
        type: 'IN'
      });

      const {
        data: { getTransactionsByWallet: actualResult }
      } = await request(app)
        .query(gql`
          query GetTransactionsByWallet(
            $walletId: ID!
            $description: String
            $greaterThan: Int
          ) {
            getTransactionsByWallet(
              walletId: $walletId
              description: $description
              greaterThan: $greaterThan
            ) {
              amount
              description
              created_at
              type
            }
          }
        `)
        .variables({
          walletId: stevenWalletId,
          greaterThan: amountFilterValue,
          description: descriptionFilterValue
        })
        .expectNoErrors();

      const parsedExpectedResult = [
        {
          amount: stevenTransaction.amount,
          description: stevenTransaction.description,
          created_at: stevenTransaction.created_at,
          type: stevenTransaction.type
        }
      ];
      expect(JSON.stringify(actualResult)).toEqual(
        JSON.stringify(parsedExpectedResult)
      );
    });

    it('should return only the transactions with specific description', async () => {
      const descriptionFilterValue = 'No';
      const amountFilterValue = 0;
      const stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: stevenWalletId } = stevenWallet;
      const [, stevenSecondTransaction] = await transactionModel.insertMany([
        {
          amount: 10000,
          wallet: stevenWallet,
          description: 'Something',
          type: 'IN'
        },
        {
          amount: 10000,
          wallet: stevenWallet,
          description: 'No',
          type: 'IN'
        }
      ]);

      const {
        data: { getTransactionsByWallet: actualResult }
      } = await request(app)
        .query(gql`
          query GetTransactionsByWallet(
            $walletId: ID!
            $description: String
            $greaterThan: Int
          ) {
            getTransactionsByWallet(
              walletId: $walletId
              description: $description
              greaterThan: $greaterThan
            ) {
              amount
              description
              created_at
              type
            }
          }
        `)
        .variables({
          walletId: stevenWalletId,
          greaterThan: amountFilterValue,
          description: descriptionFilterValue
        })
        .expectNoErrors();

      const parsedExpectedResult = [
        {
          amount: stevenSecondTransaction.amount,
          description: stevenSecondTransaction.description,
          created_at: stevenSecondTransaction.created_at,
          type: stevenSecondTransaction.type
        }
      ];
      expect(JSON.stringify(actualResult)).toEqual(
        JSON.stringify(parsedExpectedResult)
      );
    });

    it(
      'should return only the transactions that have amount greater than' +
        ' equal the filter',
      async () => {
        const descriptionFilterValue = '';
        const amountFilterValue = 6000;
        const stevenWallet = await walletModel.create({ balance: 0 });
        const { _id: stevenWalletId } = stevenWallet;
        const [, stevenSecondTransaction] = await transactionModel.insertMany([
          {
            amount: 5000,
            wallet: stevenWallet,
            description: 'Something',
            type: 'IN'
          },
          {
            amount: 10000,
            wallet: stevenWallet,
            description: 'No',
            type: 'IN'
          }
        ]);

        const {
          data: { getTransactionsByWallet: actualResult }
        } = await request(app)
          .query(gql`
            query GetTransactionsByWallet(
              $walletId: ID!
              $description: String
              $greaterThan: Int
            ) {
              getTransactionsByWallet(
                walletId: $walletId
                description: $description
                greaterThan: $greaterThan
              ) {
                amount
                description
                created_at
                type
              }
            }
          `)
          .variables({
            walletId: stevenWalletId,
            greaterThan: amountFilterValue,
            description: descriptionFilterValue
          })
          .expectNoErrors();

        const parsedExpectedResult = [
          {
            amount: stevenSecondTransaction.amount,
            description: stevenSecondTransaction.description,
            created_at: stevenSecondTransaction.created_at,
            type: stevenSecondTransaction.type
          }
        ];
        expect(JSON.stringify(actualResult)).toEqual(
          JSON.stringify(parsedExpectedResult)
        );
      }
    );
  });

  describe('/graphql createTransaction', () => {
    it('should create new transaction by given data', async () => {
      const stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: stevenWalletId } = stevenWallet;
      const createTransactionData = {
        amount: '10000',
        walletId: stevenWalletId,
        description: 'Something',
        type: 'IN'
      };

      const {
        data: { createTransaction: actualResult }
      } = await request(app)
        .query(gql`
          mutation createTransactionData(
            $createTransactionData: CreateTransactionData!
          ) {
            createTransaction(createTransactionData: $createTransactionData) {
              amount
              created_at
              description
              type
              id
            }
          }
        `)
        .variables({
          createTransactionData
        })
        .expectNoErrors();

      const {
        _id: id,
        amount,
        type,
        description,
        created_at
      } = await transactionModel.findById(actualResult.id);
      const parsedExpectedResult = {
        amount,
        created_at,
        description,
        type,
        id
      };
      expect(JSON.stringify(actualResult)).toEqual(
        JSON.stringify(parsedExpectedResult)
      );
    });

    it('should throw error if balance is less than the withdraw amount', async () => {
      const errorMessage = 'Balance is not enough';
      const errorStatusCode = 'BAD_USER_INPUT';
      const stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: stevenWalletId } = stevenWallet;
      const createTransactionData = {
        amount: '10000',
        walletId: stevenWalletId,
        description: 'Something',
        type: 'OUT'
      };

      const { errors } = await request(app)
        .query(gql`
          mutation createTransactionData(
            $createTransactionData: CreateTransactionData!
          ) {
            createTransaction(createTransactionData: $createTransactionData) {
              amount
              created_at
              description
              type
              id
            }
          }
        `)
        .variables({
          createTransactionData
        });

      const [
        {
          message,
          extensions: { code }
        }
      ] = errors;
      expect(message).toBe(errorMessage);
      expect(code).toBe(errorStatusCode);
    });

    it(
      'should throw error if creating transaction using data that have' +
        ' missing field',
      async () => {
        const stevenWallet = await walletModel.create({ balance: 0 });
        const { _id: stevenWalletId } = stevenWallet;
        const errorMessage =
          'Variable "$createTransactionData" got invalid value { amount:' +
          ` "10000", walletId: "${stevenWalletId}", description: "Something" }; Field` +
          ' "type" of required type "TransactionType!" was not provided.';
        const errorStatusCode = 'BAD_USER_INPUT';
        const createTransactionData = {
          amount: '10000',
          walletId: stevenWalletId,
          description: 'Something'
        };

        const { errors } = await request(app)
          .query(gql`
            mutation createTransactionData(
              $createTransactionData: CreateTransactionData!
            ) {
              createTransaction(createTransactionData: $createTransactionData) {
                amount
                created_at
                description
                type
                id
              }
            }
          `)
          .variables({
            createTransactionData
          });

        const [
          {
            message,
            extensions: { code }
          }
        ] = errors;
        expect(message).toBe(errorMessage);
        expect(code).toBe(errorStatusCode);
      }
    );

    it('should throw error if creating transaction using incorrect data', async () => {
      const stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: stevenWalletId } = stevenWallet;
      const errorMessage =
        'Variable "$createTransactionData" got invalid value "NO TYPE" at "createTransactionData.type"; Value "NO TYPE" does not exist in "TransactionType" enum.';
      const errorStatusCode = 'BAD_USER_INPUT';
      const createTransactionData = {
        amount: '10000',
        walletId: stevenWalletId,
        description: 'Something',
        type: 'NO TYPE'
      };

      const { errors } = await request(app)
        .query(gql`
          mutation createTransactionData(
            $createTransactionData: CreateTransactionData!
          ) {
            createTransaction(createTransactionData: $createTransactionData) {
              amount
              created_at
              description
              type
              id
            }
          }
        `)
        .variables({
          createTransactionData
        });

      const [
        {
          message,
          extensions: { code }
        }
      ] = errors;
      expect(message).toBe(errorMessage);
      expect(code).toBe(errorStatusCode);
    });
  });
});
