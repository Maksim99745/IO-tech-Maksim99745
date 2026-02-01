module.exports = ({ env }) => {
  // Use persistent disk path on Render, or default to .tmp for local
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
