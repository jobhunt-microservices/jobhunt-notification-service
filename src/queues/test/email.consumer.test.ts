import { exchangeNames, queueNames, routingKeys } from '@notifications/constants/queue.constant';
import * as connection from '@notifications/queues/connections';
import { emailConsumes } from '@notifications/queues/consumers/email.consumer';
import { Channel } from 'amqplib';

jest.mock('@notifications/queues/connections');
jest.mock('amqplib');
jest.mock('@jobhunt-microservices/jobhunt-shared');

describe('Email consumer', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages() method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: queueNames.SEND_EMAIL,
        messageCount: 0,
        consumerCount: 0
      });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: Channel | undefined = await connection.createConnection();
      await emailConsumes.consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(exchangeNames.SEND_EMAIL, 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(queueNames.SEND_EMAIL, exchangeNames.SEND_EMAIL, routingKeys.SEND_EMAIL);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
    });
  });

  describe('consumeOrderEmailMessages() method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: queueNames.ORDER_UPDATE,
        messageCount: 0,
        consumerCount: 0
      });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: Channel | undefined = await connection.createConnection();
      await emailConsumes.consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(exchangeNames.ORDER_UPDATE, 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        queueNames.ORDER_UPDATE,
        exchangeNames.ORDER_UPDATE,
        routingKeys.ORDER_UPDATE
      );
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
    });
  });
});
