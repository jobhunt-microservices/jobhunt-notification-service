import { ExchangeNames, getErrorMessage, QueueNames, RoutingKeys } from '@jobhunt-microservices/jobhunt-shared';
import { SERVICE_NAME } from '@notifications/constants';
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
      await channel.assertExchange(ExchangeNames.USER_CREATED, 'direct');
      const jobhuntQueue = await channel.assertQueue(QueueNames.USER_CREATED, { durable: true, autoDelete: false });
      await channel.bindQueue(jobhuntQueue.queue, ExchangeNames.USER_CREATED, RoutingKeys.USER_CREATED);
      channel.consume(jobhuntQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { username, email } = JSON.parse(msg.content.toString());
          console.log(`User ${username} has been created ${new Date()}`);
          channel.ack(msg);
        } else {
          log.info(SERVICE_NAME + ` channel consumer en: ${ExchangeNames.USER_CREATED}, rk: ${RoutingKeys.USER_CREATED} is empty`);
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const authConsumes = new AuthConsumes();
