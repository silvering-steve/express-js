import request from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bookSchema from '../../src/schemas/bookSchema';

let model;

beforeAll(() => {
  mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  model = mongoose.model('Sample', bookSchema);
});

afterEach(async () => {
  await model.deleteMany();
});

describe('BookController', () => {
  describe('GET /books', () => {
    // it('should ', () => {
      
    // });
  });
});
