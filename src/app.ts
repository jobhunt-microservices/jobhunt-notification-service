import { SERVICE_NAME } from '@notifications/constants';
import { NotificationServer } from '@notifications/server';
import { logger } from '@notifications/utils/logger.util';
import express, { Express } from 'express';
const log = logger('notificationApp', 'debug');

class Application {
  public initialize() {
    const app: Express = express();
    const server = new NotificationServer(app);
    server.start();
    log.info(SERVICE_NAME + ' initialized');
  }
}

const application = new Application();
application.initialize();
