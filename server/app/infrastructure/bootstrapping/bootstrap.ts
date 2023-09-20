import { TYPES } from '../../domain/constants/types';
import cors from 'cors';
import express from 'express';
import { Container, ContainerModule } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import passport from 'passport';
import { Server as SocketServer } from 'socket.io';
import { ChatSocketService } from '../../domain/services/sockets/chat-socket.service';
import { exceptionLoggerMiddleware, reqMiddleware } from './middleware';
import {
  jwtStrategyMiddleware,
  passportLoginMiddleware,
  passportRegisterMiddleware,
} from '../../api/middleware/auth_middleware';
import { DbClient, getDatabaseClient } from '../data_access/db_client';
import { DrawingSocketService } from '../../domain/services/sockets/drawing-socket.service';

// Controller injection is done through imports
// Simply add the controller import here, and it should register within our
// express application.
import '../../api/controllers/hello-world.controller';
import '../../api/controllers/authentication.controller';
import '../../api/controllers/user.controller';
import '../../api/controllers/text-channel.controller';
import '../../api/controllers/team.controller';
import '../../api/controllers/drawing.controller';
import '../../api/controllers/message.controller';
import '../../api/controllers/avatar.controller';
import '../../api/controllers/search.controller';
import '../../api/controllers/post.controller';

export const boostrap = async (
  container: Container,
  appPort: number | string | boolean,
  dbUsername: string,
  dbPassword: string,
  dbCluster: string,
  ...modules: ContainerModule[]
) => {
  if (container.isBound(TYPES.Application) === false) {
    const dbClient = await getDatabaseClient(dbUsername, dbPassword, dbCluster);
    container.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
    container.load(...modules);
    const server = new InversifyExpressServer(container, null, {
      rootPath: '/api',
    });

    server.setConfig((app) => {
      app.set('etag', false);

      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      app.use(cors());

      app.use(reqMiddleware);

      app.use(passport.initialize());
    });

    server.setErrorConfig((app) => {
      app.use(exceptionLoggerMiddleware);
    });

    // Set passport middleware
    passportRegisterMiddleware();
    passportLoginMiddleware();
    jwtStrategyMiddleware();

    const app = server.build();

    console.log(`Application listening on port ${appPort}`);

    const serverInstance = app.listen(appPort);

    const socketServer = new SocketServer(serverInstance, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    const chatSocketService: ChatSocketService = container.get(
      TYPES.ChatSocketService,
    );
    chatSocketService.init(socketServer);

    const drawingSocketService: DrawingSocketService = container.get(
      TYPES.DrawingSocketService,
    );
    drawingSocketService.init(socketServer);

    container.bind<express.Application>(TYPES.Application).toConstantValue(app);
    return app;
  } else {
    return container.get<express.Application>(TYPES.Application);
  }
};

export const normalizePort = (
  val: number | string,
): number | string | boolean => {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
};
