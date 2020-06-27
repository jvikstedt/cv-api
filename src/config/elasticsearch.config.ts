import { ElasticsearchOptionsFactory, ElasticsearchModuleOptions } from "@nestjs/elasticsearch";
import * as config from 'config';
import {
  CONFIG_ELASTICSEARCH,
  CONFIG_ELASTICSEARCH_PORT,
} from '../constants';

const elasticConfig = config.get(CONFIG_ELASTICSEARCH);

export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    const port = process.env.ELASTICSEARCH_PORT || elasticConfig[CONFIG_ELASTICSEARCH_PORT]
    const node = `http://localhost:${port}`;
    return {
      node,
    };
  }
}
