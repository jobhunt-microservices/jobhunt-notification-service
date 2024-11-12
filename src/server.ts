import 'express-async-errors';

import { SERVICE_NAME } from '@notifications/constants';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connections';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/consumers/email.consumer';
import { healthRoutes } from '@notifications/routes';
import { logger } from '@notifications/utils/logger.util';
import { Application } from 'express';
import http from 'http';

const SERVER_PORT = 4001;

const log = logger('notificationServer', 'debug');

export const start = (app: Application): void => {
  startServer(app);
  app.use('', healthRoutes());

  startQueues();
  startElasticSearch();
};

const startQueues = async () => {
  const emailChannel = await createConnection();
  if (emailChannel) {
    await consumeAuthEmailMessages(emailChannel);
    await consumeOrderEmailMessages(emailChannel);
  } else {
    log.log('error', SERVICE_NAME + ` start queue failed, channel undefined`);
  }
};

const startElasticSearch = () => {
  checkConnection();
};

const startServer = (app: Application) => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification service has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(SERVICE_NAME + ` running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', SERVICE_NAME + ' startServer() method:', error);
  }
};
