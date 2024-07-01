import request from 'supertest-graphql';
import gql from 'graphql-tag';
import app from '../src/app-dummy';

describe('app', () => {
  describe('getWallets', () => {
    it('should respond with Hello World and status code 200', async () => {
      const actualResult = await request(app).query(gql`
        query {
          healthCheck
        }
      `);

      console.log(actualResult);
    });
  });
});
