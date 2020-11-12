import {
  ElasticsearchOptionsFactory,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';
import * as config from 'config';
import {
  CONFIG_ELASTICSEARCH,
  CONFIG_ELASTICSEARCH_PORT,
  CONFIG_ELASTICSEARCH_HOST,
} from '../constants';

const elasticConfig = config.get(CONFIG_ELASTICSEARCH);

export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    const host =
      process.env.ELASTICSEARCH_HOST ||
      elasticConfig[CONFIG_ELASTICSEARCH_HOST];
    const port =
      process.env.ELASTICSEARCH_PORT ||
      elasticConfig[CONFIG_ELASTICSEARCH_PORT];
    const node = `${host}:${port}`;
    return {
      node,
    };
  }
}
