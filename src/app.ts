import { SERVICE_NAME } from '@notifications/constants';
import { start } from '@notifications/server';
import { logger } from '@notifications/utils/logger.util';
import express, { Express } from 'express';
const log = logger('notificationApp', 'debug');
const initialize = (): void => {
  const app: Express = express();
  start(app);
  log.info(SERVICE_NAME + ' initialized');
};

initialize();
