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
  CONFIG_DB_LOGGING,
  CONFIG_DB_MIGRATIONS_RUN,
} from '../constants';

const dbConfig = config.get(CONFIG_DB);

export = {
  type: dbConfig[CONFIG_DB_TYPE],
  host: process.env.DB_HOSTNAME || dbConfig[CONFIG_DB_HOST],
  port: process.env.DB_PORT || dbConfig[CONFIG_DB_PORT],
  username: process.env.DB_USERNAME || dbConfig[CONFIG_DB_USERNAME],
  password: process.env.DB_PASSWORD || dbConfig[CONFIG_DB_PASSWORD],
  database: process.env.DB_NAME || dbConfig[CONFIG_DB_DATABASE],
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  factories: [__dirname + '/../**/*.factory.{js,ts}'],
  migrations: [__dirname + '/../../database/migrations/**/*.{js,ts}'],
  seeds: [__dirname + '/../../database/seeds/**/*.{js,ts}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun:
    process.env.TYPEORM_MIGRATIONS_RUN || dbConfig[CONFIG_DB_MIGRATIONS_RUN],
  subscribers: [__dirname + '/../**/*.subscriber.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig[CONFIG_DB_SYNCHRONIZE],
  logging: process.env.DB_LOGGING || dbConfig[CONFIG_DB_LOGGING],
  cli: {
    migrationsDir: './database/migrations',
  },
};
