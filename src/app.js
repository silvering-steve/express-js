import express from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './library.json';
import initializeRoutes from './routers';
import errorMiddleware from './middlewares/errorMiddleware';
import 'dotenv/config';

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());

app.get('/', (request, response) => {
  const { name = 'World' } = request.query;

  response.status(StatusCodes.OK).send(`Hello ${name}!`);
});


const createModels = () => {
  // return {
    //     bookModel: model('Book', bookSchema),
    // };
  };
  
  const createServices = (models) => {
    // const { bookModel } = models;
    // const bookService = new BookService(bookModel, authorService);
    // return {bookService};
  };

  const createController = (services) => {
  // const { bookService } = services;
  // return {
  //   bookController: new BookController(bookService),
  // };
};

const initializeDependencies = () => {
  // const models = createModels();
  // const services = createServices(models);
  // app.locals.controllers = createController(services);
};

const main = async () => {
  initializeDependencies();
  initializeRoutes(app);
};

main();

app.use(errorMiddleware);

export default app;
