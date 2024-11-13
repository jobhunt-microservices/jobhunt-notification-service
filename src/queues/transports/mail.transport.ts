import { IEmailLocals } from '@jobhunt-microservices/jobhunt-shared';
import { SERVICE_NAME } from '@notifications/constants';
import { sendMailTemplates } from '@notifications/emails/send-email';
import { logger } from '@notifications/utils/logger.util';

const log = logger('mailTransport', 'debug');

class MailTransport {
  public sendEmail = async (template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> => {
    try {
      await sendMailTemplates.sendEmail(template, receiverEmail, locals);
      log.info('Email sent successfully');
    } catch (error) {
      log.log('error', SERVICE_NAME + ' sendEmail() method:', error);
    }
  };
}

export const mailTransport = new MailTransport();
