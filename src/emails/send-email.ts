import { IEmailLocals } from '@jobhunt-microservices/jobhunt-shared';
import { config } from '@notifications/config';
import { SERVICE_NAME } from '@notifications/constants';
import { logger } from '@notifications/utils/logger.util';
import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

const log = logger('mailTransport', 'debug');

export const sendEmailByTemplate = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_PASSWORD
      }
    });
    const email: Email = new Email({
      message: {
        from: `Jobhunt app <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.resolve('build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '/templates', template),
      message: {
        to: receiver
      },
      locals
    });
  } catch (error) {
    log.log('error', SERVICE_NAME + ' sendEmailByTemplate() method:', error);
  }
};

console.log(__dirname);
console.log(path.join(__dirname, '/templates'));
