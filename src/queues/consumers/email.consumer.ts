import { ExchangeNames, IEmailLocals, QueueNames, RoutingKeys, getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import { config } from '@notifications/config';
import { SERVICE_NAME } from '@notifications/constants';
import { emailTemplates } from '@notifications/constants/email-templates.constant';
import { LOGO_PUBLIC_URL } from '@notifications/constants/external.constant';
import { createConnection } from '@notifications/queues/connections';
import { mailTransport } from '@notifications/queues/transports/mail.transport';
import { logger } from '@notifications/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

const log = logger('notificationEmailConsumer', 'debug');

class EmailConsumes {
  public consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.SEND_EMAIL, 'direct');
      const jobhuntQueue = await channel.assertQueue(QueueNames.SEND_EMAIL, { durable: true, autoDelete: false });
      await channel.bindQueue(jobhuntQueue.queue, ExchangeNames.SEND_EMAIL, RoutingKeys.SEND_EMAIL);
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
          await mailTransport.sendEmail(template, receiverEmail, locals);
          channel.ack(msg);
        } else {
          log.info(SERVICE_NAME + ` channel consumer en: ${ExchangeNames.SEND_EMAIL}, rk: ${RoutingKeys.SEND_EMAIL} is empty`);
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };

  public consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.ORDER_UPDATE, 'direct');
      const jobhuntQueue = await channel.assertQueue(QueueNames.ORDER_UPDATE, { durable: true, autoDelete: false });
      await channel.bindQueue(jobhuntQueue.queue, ExchangeNames.ORDER_UPDATE, RoutingKeys.ORDER_UPDATE);
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
            await mailTransport.sendEmail(emailTemplates.ORDER_PLACED, receiverEmail, locals);
            await mailTransport.sendEmail(emailTemplates.ORDER_RECEIPT, receiverEmail, locals);
          } else {
            await mailTransport.sendEmail(template, receiverEmail, locals);
          }
          channel.ack(msg);
        } else {
          log.info(SERVICE_NAME + ` channel consumer en: ${ExchangeNames.ORDER_UPDATE}, rk: ${RoutingKeys.ORDER_UPDATE} is empty`);
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const emailConsumes = new EmailConsumes();
