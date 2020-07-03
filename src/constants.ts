export const UNIQUENESS_VIOLATION = '23505';

export const CONFIG_JWT = 'jwt';
export const CONFIG_JWT_SECRET = 'secret';
export const CONFIG_JWT_EXPIRES_IN = 'expiresIn';

export const CONFIG_SERVER = 'server';
export const CONFIG_SERVER_PORT = 'port';

export const CONFIG_DB = 'db';
export const CONFIG_DB_TYPE = 'type';
export const CONFIG_DB_HOST = 'host';
export const CONFIG_DB_PORT = 'port';
export const CONFIG_DB_USERNAME = 'username';
export const CONFIG_DB_PASSWORD = 'password';
export const CONFIG_DB_DATABASE = 'database';
export const CONFIG_DB_SYNCHRONIZE = 'synchronize';

export const CONFIG_ELASTICSEARCH = 'elasticsearch';
export const CONFIG_ELASTICSEARCH_PORT = 'port';

export const CONFIG_REDIS = 'redis';
export const CONFIG_REDIS_PORT = 'port';

export const CONFIG_QUEUE = 'queue';
export const CONFIG_QUEUE_CV_RELOAD = 'cvReloadDelay';

export const ELASTIC_INDEX_CV = 'cv';

export const QUEUE_NAME_SKILL_SUBJECTS = 'skillSubjects';
export const QUEUE_NAME_SKILLS = 'skills';
export const QUEUE_NAME_CV = 'cv';
export const QUEUE_NAME_USERS = 'users';

export const EXPORTER_PDF = 'pdf';

export enum EventType {
  Insert = 'insert',
  Update = 'update',
  Remove = 'remove',
  Reload = 'reload',
};
