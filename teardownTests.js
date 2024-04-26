const stopServer = async () => {
  await globalThis.MONGOD.stop();
};

export default stopServer;
