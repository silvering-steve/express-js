// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, request, response, next) => {
  const { statusCode, message } = error;
  response.status(statusCode).json({ message });
};

export default errorMiddleware;
