import { IEmailLocals } from '@jobhunt-microservices/jobhunt-shared';
import { config } from '@notifications/config';
import { SERVICE_NAME } from '@notifications/constants';
import { emailTemplates } from '@notifications/constants/email-templates.constant';
import { LOGO_PUBLIC_URL } from '@notifications/constants/external.constant';
import { exchangeNames, queueNames, routingKeys } from '@notifications/constants/queue.constant';
import { createConnection } from '@notifications/queues/connections';
import { sendEmail } from '@notifications/queues/transports/mail.transport';
import { logger } from '@notifications/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

const log = logger('notificationEmailConsumer', 'debug');

export const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    channel.assertExchange(exchangeNames.EMAIL_NOTIFICATION, 'direct');
    const jobhuntQueue = await channel.assertQueue(queueNames.AUTH_EMAIL, { durable: true, autoDelete: false });
    await channel.bindQueue(jobhuntQueue.queue, exchangeNames.EMAIL_NOTIFICATION, routingKeys.AUTH_EMAIL);
    channel.consume(jobhuntQueue.queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
        const locals: IEmailLocals = {
          appLink: `${config.CLIENT_URL}`,
          appIcon: LOGO_PUBLIC_URL,
          username,
          verifyLink,
          resetLink
        };
        await sendEmail(template, receiverEmail, locals);
        channel.ack(msg);
      } else {
        log.info(SERVICE_NAME + ` channel consumer en: ${exchangeNames.EMAIL_NOTIFICATION}, rk: ${routingKeys.AUTH_EMAIL} is empty`);
      }
    });
  } catch (error) {
    log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', error);
  }
};

export const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    channel.assertExchange(exchangeNames.ORDER_NOTIFICATION, 'direct');
    const jobhuntQueue = await channel.assertQueue(queueNames.ORDER_EMAIL, { durable: true, autoDelete: false });
    await channel.bindQueue(jobhuntQueue.queue, exchangeNames.ORDER_NOTIFICATION, routingKeys.ORDER_EMAIL);
    channel.consume(jobhuntQueue.queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const {
          receiverEmail,
          username,
          template,
          sender,
          offerLink,
          amount,
          buyerUsername,
          sellerUsername,
          title,
          description,
          deliveryDays,
          orderId,
          orderDue,
          requirements,
          orderUrl,
          originalDate,
          newDate,
          reason,
          subject,
          header,
          type,
          message,
          serviceFee,
          total
        } = JSON.parse(msg!.content.toString());
        const locals: IEmailLocals = {
          appLink: `${config.CLIENT_URL}`,
          appIcon: LOGO_PUBLIC_URL,
          username,
          sender,
          offerLink,
          amount,
          buyerUsername,
          sellerUsername,
          title,
          description,
          deliveryDays,
          orderId,
          orderDue,
          requirements,
          orderUrl,
          originalDate,
          newDate,
          reason,
          subject,
          header,
          type,
          message,
          serviceFee,
          total
        };
        if (template === emailTemplates.ORDER_PLACED) {
          await sendEmail(emailTemplates.ORDER_PLACED, receiverEmail, locals);
          await sendEmail(emailTemplates.ORDER_RECEIPT, receiverEmail, locals);
        } else {
          await sendEmail(template, receiverEmail, locals);
        }
        channel.ack(msg);
      } else {
        log.info(SERVICE_NAME + ` channel consumer en: ${exchangeNames.ORDER_NOTIFICATION}, rk: ${routingKeys.ORDER_EMAIL} is empty`);
      }
    });
  } catch (error) {
    log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', error);
  }
};
