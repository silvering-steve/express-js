import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../src/app';

describe('app', () => {
  describe('GET /', () => {
    it('should respond with Hello World and status code 200', async () => {
      const expectedRespondBody = 'Hello World!';
      const expectedStatusCode = 200;

      const actualResult = await request(app).get('/');

      const { statusCode, text } = actualResult;
      expect(statusCode).toEqual(expectedStatusCode);
      expect(text).toEqual(expectedRespondBody);
    });

    it('should respond with Hello Steven and status code 200', async () => {
      const name = 'Steven';
      const expectedRespondBody = 'Hello Steven!';
      const expectedStatusCode = StatusCodes.OK;

      const actualResult = await request(app).get(`/?name=${name}`);

      const { statusCode, text } = actualResult;
      expect(statusCode).toEqual(expectedStatusCode);
      expect(text).toEqual(expectedRespondBody);
    });
  });
});
