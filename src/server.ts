import express, { Request, Response, NextFunction, Express } from 'express';

import Logging from './library/Logging';
import { config } from './config/config';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

import { AppDataSource } from './data-source';

import userRoutes from './routes/User.routes';
import chatRoutes from './routes/Chat.routes';
import messageRoutes from './routes/Message.routes';

import { notFound, errorHandler } from './middlewares/errorMiddleware';
import { socketConnection } from './socket_controller/socketManager';

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(config.server.port, () => {
  Logging.info(`<-- Server started on PORT -->: ${config.server.port}`);
});

AppDataSource.initialize()
  .then(() => {
    Logging.info('<-- Database Initialized -->');
    StartServer();
  })
  .catch((err) => {
    Logging.error(`<-- Error Initializing Database -->  ${err}`);
  });

const StartServer = async () => {
  /** Rules of our API */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // TODO: Restrict to Client APIs
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'POST,PUT,PATCH,DELETE,GET');
      return res.status(200).json({});
    }

    next();
  });

  /** Logging Request and Response */
  app.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(`Incoming --> Method : [${req.method}] - URL : [${req.url}] `);
    res.on('finish', () => {
      /** Log the Response */
      Logging.info(
        `Outgoing --> Method : [${req.method}] - URL : [${req.url}] `
      );
    });

    next();
  });

  /** Routes */
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/api/user', userRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/message', messageRoutes);

  /** Health Check */
  app.get('/health', (req: Request, res: Response) =>
    res.status(200).json({ message: 'API Working 👍 ' })
  );

  /** Error Handling */
  app.use(notFound);
  app.use(errorHandler);

  await socketConnection(server);
};

export { app, server };
