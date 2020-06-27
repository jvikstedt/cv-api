import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import {
  CONFIG_DB,
  CONFIG_DB_TYPE,
  CONFIG_DB_HOST,
  CONFIG_DB_PORT,
  CONFIG_DB_USERNAME,
  CONFIG_DB_PASSWORD,
  CONFIG_DB_DATABASE,
  CONFIG_DB_SYNCHRONIZE,
} from '../constants';

const dbConfig = config.get(CONFIG_DB);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig[CONFIG_DB_TYPE],
  host: process.env.DB_HOSTNAME || dbConfig[CONFIG_DB_HOST],
  port: process.env.DB_PORT || dbConfig[CONFIG_DB_PORT],
  username: process.env.DB_USERNAME || dbConfig[CONFIG_DB_USERNAME],
  password: process.env.DB_PASSWORD || dbConfig[CONFIG_DB_PASSWORD],
  database: process.env.DB_NAME || dbConfig[CONFIG_DB_DATABASE],
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig[CONFIG_DB_SYNCHRONIZE],
}
