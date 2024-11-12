export const emailTemplates = {
  FORGOT_PASSWORD: 'forgotPassword',
  OFFER: 'offer',
  ORDER_DELIVERED: 'orderDelivered',
  ORDER_EXTENSION: 'orderExtension',
  ORDER_EXTENSION_APPROVAL: 'orderExtensionApproval',
  ORDER_PLACED: 'orderPlaced',
  ORDER_RECEIPT: 'orderReceipt',
  RESET_PASSWORD_SUCCESS: 'resetPasswordSuccess',
  VERIFY_EMAIL: 'verifyEmail'
} as const satisfies Record<string, string>;
