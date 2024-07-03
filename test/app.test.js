import request from 'supertest-graphql';
import gql from 'graphql-tag';
import app from '../src/app';

describe('app', () => {
  describe('healthCheck', () => {
    it('should respond with I Love You and undefined errors', async () => {
      const responseData = 'I Love You Haruka';

      const { errors, data } = await request(app).query(gql`
        query {
          healthCheck
        }
      `);

      expect(errors).toBeUndefined();
      expect(data.healthCheck).toBe(responseData);
    });
  });
});
