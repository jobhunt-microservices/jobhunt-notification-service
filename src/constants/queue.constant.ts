export const exchangeNames = {
  SEND_EMAIL: 'jobhunt-send-email',
  USER_CREATED: 'jobhunt-user-created',
  BUY_CREATED: 'jobhunt-buyer-created',
  ORDER_UPDATE: 'jobhunt-order-update'
} as const satisfies Record<string, string>;

export const routingKeys = {
  SEND_EMAIL: 'send.email',
  USER_CREATED: 'user.created',
  BUYER_CREATED: 'buyer.created',
  ORDER_UPDATE: 'order.update'
} as const satisfies Record<string, string>;

export const queueNames = {
  SEND_EMAIL: 'send.email.queue',
  USER_CREATED: 'user.created.queue',
  BUYER_CREATED: 'buyer.created.queue',
  ORDER_UPDATE: 'order.update.queue'
} as const satisfies Record<string, string>;
