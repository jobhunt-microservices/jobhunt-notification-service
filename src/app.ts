import { SERVICE_NAME } from '@notifications/constants';
import { NotificationServer } from '@notifications/server';
import { logger } from '@notifications/utils/logger.util';
import express, { Express } from 'express';
const log = logger('notificationApp', 'debug');
const initialize = (): void => {
  const app: Express = express();
  new NotificationServer(app).start();
  log.info(SERVICE_NAME + ' initialized');
};

initialize();
