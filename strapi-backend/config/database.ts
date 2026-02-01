module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', process.env.RENDER ? true : false) ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          } : false,
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // SQLite fallback for local development
  const dbPath = env('DATABASE_FILENAME') || '.tmp/data.db';
  
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: dbPath,
      },
      useNullAsDefault: true,
    },
  };
};
