export const UNIQUENESS_VIOLATION = '23505';

export const CONFIG_JWT = 'jwt';
export const CONFIG_JWT_SECRET = 'secret';
export const CONFIG_JWT_EXPIRES_IN = 'expiresIn';

export const CONFIG_GOOGLE = 'google';
export const CONFIG_GOOGLE_CLIENT_ID = 'clientID';

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
export const CONFIG_DB_MIGRATIONS_RUN = 'migrationsRun';
export const CONFIG_DB_LOGGING = 'logging';

export const CONFIG_ELASTICSEARCH = 'elasticsearch';
export const CONFIG_ELASTICSEARCH_PORT = 'port';
export const CONFIG_ELASTICSEARCH_HOST = 'host';
export const CONFIG_ELASTICSEARCH_USERNAME = 'username';
export const CONFIG_ELASTICSEARCH_PASSWORD = 'password';

export const CONFIG_REDIS = 'redis';
export const CONFIG_REDIS_PORT = 'port';
export const CONFIG_REDIS_HOST = 'host';

export const CONFIG_QUEUE = 'queue';
export const CONFIG_QUEUE_CV_RELOAD = 'cvReloadDelay';
export const QUEUE_NAME_CV = 'cv';

export const ELASTIC_INDEX_CV = 'cv';

export const EXPORTER_PDF = 'pdf';

export const ROUTE_METADATA_IS_PUBLIC = 'IS_PUBLIC';
export const ROUTE_METADATA_ALLOW_CV_OWNER = 'ALLOW_CV_OWNER';
export const ROUTE_METADATA_ALLOW_USER_OWNER = 'ALLOW_USER_OWNER';
export const ROUTE_METADATA_ALLOWED_ROLES = 'ALLOWED_ROLES';
export const ROUTE_METADATA_ALLOW_AUTHENTICATED = 'ALLOW_AUTHENTICATED';

export const ADMIN_ROLE = 'ADMIN';

export enum EventType {
  Insert = 'insert',
  Update = 'update',
  Remove = 'remove',
  Reload = 'reload',
}
