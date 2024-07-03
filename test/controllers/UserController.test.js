import mongoose from 'mongoose';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

import userSchema from '../../src/schemas/UserSchema';
import walletSchema from '../../src/schemas/WalletSchema';
import app from '../../src/app';

import 'dotenv/config';

let userModel;
let walletModel;

beforeAll(() => {
  mongoose.connect(process.env.DATABASE_TEST_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  walletModel = mongoose.model('Wallet', walletSchema);
  userModel = mongoose.model('User', userSchema);
});

afterEach(async () => {
  await userModel.deleteMany();
  await walletModel.deleteMany();
});

describe('UserController', () => {
  describe('/graphql getUsers', () => {
    it('should return all the user available', async () => {
      const [stevenWallet, valenWallet] = await walletModel.insertMany([
        { balance: 0 },
        { balance: 0 }
      ]);
      const users = await userModel.insertMany([
        {
          name: 'Steven',
          phone: '1234',
          address: 'Jakarta',
          birthdate: Date.now(),
          wallet: stevenWallet
        },
        {
          name: 'Valen',
          phone: '4321',
          address: 'Semarang',
          birthdate: Date.now(),
          wallet: valenWallet
        }
      ]);
      const expectedResult = users.map(
        ({ phone, wallet, name, birthdate, address, created_at }) => ({
          phone,
          wallet: { balance: wallet.balance },
          name,
          birthdate,
          address,
          created_at
        })
      );

      const {
        data: { getUsers: actualResult }
      } = await request(app)
        .query(gql`
          query {
            getUsers {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              created_at
            }
          }
        `)
        .expectNoErrors();

      expect(`${JSON.stringify(actualResult)}`).toEqual(
        `${JSON.stringify(expectedResult)}`
      );
    });
  });

  describe('/graphql getUserById', () => {
    it('should return the user with certain Id', async () => {
      const stevenWallet = await walletModel.create({ balance: 0 });
      const {
        phone,
        wallet,
        name,
        birthdate,
        address,
        created_at,
        _id: stevenId
      } = await userModel.create({
        name: 'Steven',
        phone: '1234',
        address: 'Jakarta',
        birthdate: Date.now(),
        wallet: stevenWallet
      });
      const expectedResult = {
        phone,
        wallet: { balance: wallet.balance },
        name,
        birthdate,
        address,
        created_at
      };

      const {
        data: { getUserById: actualResult }
      } = await request(app)
        .query(gql`
          query getUserById($userId: ID!) {
            getUserById(userId: $userId) {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              created_at
            }
          }
        `)
        .variables({ userId: stevenId })
        .expectNoErrors();

      expect(`${JSON.stringify(actualResult)}`).toEqual(
        `${JSON.stringify(expectedResult)}`
      );
    });

    it('should return error with status code NOT_FOUND if user is not found', async () => {
      const fakeUserId = '60d5ec49f0b92a3e9c1e7297';
      const errorMessage = `User with id:${fakeUserId} not found`;
      const errorStatusCode = 'NOT_FOUND';

      const { errors } = await request(app)
        .query(gql`
          query getUserById($userId: ID!) {
            getUserById(userId: $userId) {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              created_at
            }
          }
        `)
        .variables({ userId: fakeUserId });

      expect(errors[0].extensions.code).toBe(errorStatusCode);
      expect(errors[0].message).toBe(errorMessage);
    });

    it(
      'should return error with status code 404 if inputed with the' +
        ' incorrect id type',
      async () => {
        const fakeUserId = 'fakeID';
        const errorMessage = `User with id:${fakeUserId} not found`;
        const errorStatusCode = 'NOT_FOUND';

        const { errors } = await request(app)
          .query(gql`
            query getUserById($userId: ID!) {
              getUserById(userId: $userId) {
                phone
                wallet {
                  balance
                }
                name
                birthdate
                address
                created_at
              }
            }
          `)
          .variables({ userId: fakeUserId });

        expect(errors[0].extensions.code).toBe(errorStatusCode);
        expect(errors[0].message).toBe(errorMessage);
      }
    );
  });

  describe('/graphql createUser', () => {
    it('should create a new user with given data', async () => {
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd',
        birthdate: '2024-07-02T03:02:31.522Z'
      };

      const {
        data: { createUser: actualResult }
      } = await request(app)
        .mutate(gql`
          mutation createUser($inputUserData: InputUserData!) {
            createUser(inputUserData: $inputUserData) {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          inputUserData
        })
        .expectNoErrors();

      const expectedResult = await userModel
        .findById(actualResult.id)
        .populate('wallet');
      const parsedExpectedResult = {
        phone: expectedResult.phone,
        wallet: { balance: expectedResult.wallet.balance },
        name: expectedResult.name,
        birthdate: expectedResult.birthdate,
        address: expectedResult.address,
        id: expectedResult.id
      };
      expect(`${JSON.stringify(actualResult)}`).toEqual(
        `${JSON.stringify(parsedExpectedResult)}`
      );
    });

    it('should give error when trying to create user with not enough data', async () => {
      const errorMessage =
        'Variable "$inputUserData" got invalid value { name: "bubaddddddbi", address: "add", phone: "asdasd" }; Field "birthdate" of required type "String!" was not provided.';
      const errorStatusCode = 'BAD_USER_INPUT';
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd'
      };

      const { errors } = await request(app)
        .mutate(gql`
          mutation createUser($inputUserData: InputUserData!) {
            createUser(inputUserData: $inputUserData) {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          inputUserData
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

    it('should give error when trying to create user with incorrect data', async () => {
      const errorMessage = 'ValidationError: "birthdate" must be a valid date';
      const errorStatusCode = 'BAD_USER_INPUT';
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd',
        birthdate: 'a'
      };

      const { errors } = await request(app)
        .mutate(gql`
          mutation createUser($inputUserData: InputUserData!) {
            createUser(inputUserData: $inputUserData) {
              phone
              wallet {
                balance
              }
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          inputUserData
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

  describe('/graphql updateUser', () => {
    let stevenWallet;
    let stevenId;

    beforeEach(async () => {
      stevenWallet = await walletModel.create({ balance: 0 });
      const { _id: id } = await userModel.create({
        name: 'Steven',
        phone: '1234',
        address: 'Jakarta',
        birthdate: Date.now(),
        wallet: stevenWallet
      });
      stevenId = id;
    });

    it('should update the user data with given data', async () => {
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd',
        birthdate: '2024-07-02T03:02:31.522Z'
      };

      const {
        data: { updateUser: actualResult }
      } = await request(app)
        .mutate(gql`
          mutation updateUser($userId: ID!, $inputUserData: InputUserData!) {
            updateUser(userId: $userId, inputUserData: $inputUserData) {
              phone
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          userId: stevenId,
          inputUserData
        })
        .expectNoErrors();

      const expectedResult = await userModel.findById(actualResult.id);
      const parsedExpectedResult = {
        phone: expectedResult.phone,
        name: expectedResult.name,
        birthdate: expectedResult.birthdate,
        address: expectedResult.address,
        id: expectedResult.id
      };
      expect(`${JSON.stringify(actualResult)}`).toEqual(
        `${JSON.stringify(parsedExpectedResult)}`
      );
    });

    it('should give error when trying to update user with not enough data', async () => {
      const errorMessage =
        'Variable "$inputUserData" got invalid value { name: "bubaddddddbi", address: "add", phone: "asdasd" }; Field "birthdate" of required type "String!" was not provided.';
      const errorStatusCode = 'BAD_USER_INPUT';
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd'
      };

      const { errors } = await request(app)
        .mutate(gql`
          mutation updateUser($userId: ID!, $inputUserData: InputUserData!) {
            updateUser(userId: $userId, inputUserData: $inputUserData) {
              phone
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          userId: stevenId,
          inputUserData
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

    it('should give error when trying to update user with incorrect data', async () => {
      const errorMessage = 'ValidationError: "birthdate" must be a valid date';
      const errorStatusCode = 'BAD_USER_INPUT';
      const inputUserData = {
        name: 'bubaddddddbi',
        address: 'add',
        phone: 'asdasd',
        birthdate: 'a'
      };

      const { errors } = await request(app)
        .mutate(gql`
          mutation updateUser($userId: ID!, $inputUserData: InputUserData!) {
            updateUser(userId: $userId, inputUserData: $inputUserData) {
              phone
              name
              birthdate
              address
              id
            }
          }
        `)
        .variables({
          userId: stevenId,
          inputUserData
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
      'should return error with status code NOT_FOUND if user is not found' +
        ' when trying to update the data',
      async () => {
        const fakeUserId = '60d5ec49f0b92a3e9c1e7297';
        const errorMessage = `User with id:${fakeUserId} not found`;
        const errorStatusCode = 'NOT_FOUND';
        const inputUserData = {
          name: 'bubaddddddbi',
          address: 'add',
          phone: 'asdasd',
          birthdate: '2024-07-02T03:02:31.522Z'
        };

        const { errors } = await request(app)
          .mutate(gql`
            mutation updateUser($userId: ID!, $inputUserData: InputUserData!) {
              updateUser(userId: $userId, inputUserData: $inputUserData) {
                phone
                name
                birthdate
                address
                id
              }
            }
          `)
          .variables({
            userId: fakeUserId,
            inputUserData
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
  });
});
