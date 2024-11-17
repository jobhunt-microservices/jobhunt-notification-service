import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import { SERVICE_NAME } from '@notifications/constants';
import { exchangeNames, queueNames, routingKeys } from '@notifications/constants/queue.constant';
import { createConnection } from '@notifications/queues/connections';
import { logger } from '@notifications/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

const log = logger('notificationEmailConsumer', 'debug');

class AuthConsumes {
  public consumeAuthUserCreatedMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeNames.AUTH_NOTIFICATION, 'direct');
      const jobhuntQueue = await channel.assertQueue(queueNames.AUTH_USER, { durable: true, autoDelete: false });
      await channel.bindQueue(jobhuntQueue.queue, exchangeNames.AUTH_NOTIFICATION, routingKeys.AUTH_USER);
      channel.consume(jobhuntQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { username, email } = JSON.parse(msg.content.toString());
          console.log(`User ${username} has been created ${new Date()}`);
          channel.ack(msg);
        } else {
          log.info(SERVICE_NAME + ` channel consumer en: ${exchangeNames.AUTH_NOTIFICATION}, rk: ${routingKeys.AUTH_USER} is empty`);
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const authConsumes = new AuthConsumes();
