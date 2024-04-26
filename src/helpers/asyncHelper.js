const asyncHelper = (callback) => async (request, response, next) => {
  try {
    await callback(request, response, next);
  } catch (error) {
    next(error);
  }
};

export default asyncHelper;
