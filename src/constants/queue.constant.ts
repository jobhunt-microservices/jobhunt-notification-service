export const exchangeNames = {
  EMAIL_NOTIFICATION: 'jobhunt-email-notification',
  ORDER_NOTIFICATION: 'jobhunt-order-notification'
} as const satisfies Record<string, string>;

export const routingKeys = {
  AUTH_EMAIL: 'auth-email',
  ORDER_EMAIL: 'order-email'
} as const satisfies Record<string, string>;

export const queueNames = {
  AUTH_EMAIL: 'auth-email-queue',
  ORDER_EMAIL: 'order-email-queue'
} as const satisfies Record<string, string>;
