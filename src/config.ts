import { config as dotenvConfig } from 'dotenv';

dotenvConfig({});

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_PASSWORD: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_PASSWORD = process.env.SENDER_PASSWORD || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
