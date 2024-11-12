import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config';
import { logger } from '@notifications/utils/logger.util';
import { SERVICE_NAME } from './constants';

const log = logger('notificationElasticsearchServer', 'debug');

const elasticsearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticsearchClient.cluster.health({});
      log.info(SERVICE_NAME + ` elasticsearch healthy status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('connection to elasticsearch failed, retrying');
      log.log('error', SERVICE_NAME + ' checkConnection() method:', error);
    }
  }
}
