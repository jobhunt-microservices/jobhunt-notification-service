import 'express-async-errors';

import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import { SERVICE_NAME } from '@notifications/constants';
import { elasticSearch } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connections';
import { authConsumes } from '@notifications/queues/consumers/auth.consumer';
import { emailConsumes } from '@notifications/queues/consumers/email.consumer';
import { healthRoutes } from '@notifications/routes';
import { logger } from '@notifications/utils/logger.util';
import { Application } from 'express';
import http from 'http';

const SERVER_PORT = 4001;

const log = logger('notificationServer', 'debug');

export class NotificationServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = (): void => {
    this.startServer();
    this.app.use('', healthRoutes());
    this.startQueues();
    this.startElasticSearch();
  };

  private async startQueues() {
    const channel = await createConnection();

    if (channel) {
      channel.prefetch(1);

      await emailConsumes.consumeAuthEmailMessages(channel);
      await emailConsumes.consumeOrderEmailMessages(channel);

      await authConsumes.consumeAuthUserCreatedMessages(channel);
    } else {
      log.log('error', SERVICE_NAME + ` start queue failed, channel undefined`);
    }
  }

  private startElasticSearch() {
    elasticSearch.checkConnection();
  }

  private startServer() {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      log.info(`Worker with process id of ${process.pid} on notification service has started`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' startServer() method:', getErrorMessage(error));
    }
  }
}
