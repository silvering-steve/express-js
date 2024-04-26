import { MongoMemoryServer } from 'mongodb-memory-server';

const startServer = async () => {
  globalThis.MONGOD = await MongoMemoryServer.create();
  process.env.DB_URL = globalThis.MONGOD.getUri();
};

export default startServer;
