module.exports = ({ env }) => {
  // Use PostgreSQL if DATABASE_URL is provided, otherwise fallback to SQLite
  const client = env('DATABASE_URL') ? 'postgres' : 'sqlite';
  
  if (client === 'postgres') {
    // Parse DATABASE_URL or use individual environment variables
    const databaseUrl = env('DATABASE_URL');
    
    if (databaseUrl) {
      // Parse PostgreSQL connection string
      const url = new URL(databaseUrl);
      return {
        connection: {
          client: 'postgres',
          connection: {
            host: url.hostname,
            port: parseInt(url.port) || 5432,
            database: url.pathname.slice(1), // Remove leading '/'
            user: url.username,
            password: url.password,
            ssl: env.bool('DATABASE_SSL', false) ? {
              rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
            } : false,
          },
          pool: {
            min: env.int('DATABASE_POOL_MIN', 2),
            max: env.int('DATABASE_POOL_MAX', 10),
          },
        },
      };
    } else {
      // Use individual environment variables
      return {
        connection: {
          client: 'postgres',
          connection: {
            host: env('DATABASE_HOST', 'localhost'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'strapi'),
            user: env('DATABASE_USERNAME', 'strapi'),
            password: env('DATABASE_PASSWORD', 'strapi'),
            ssl: env.bool('DATABASE_SSL', false) ? {
              rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
            } : false,
          },
          pool: {
            min: env.int('DATABASE_POOL_MIN', 2),
            max: env.int('DATABASE_POOL_MAX', 10),
          },
        },
      };
    }
  }
  
  // Fallback to SQLite for local development
  const dbPath = env('DATABASE_FILENAME') || 
    (process.env.RENDER ? '/opt/render/project/src/strapi-backend/.tmp/data.db' : '.tmp/data.db');
  
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
