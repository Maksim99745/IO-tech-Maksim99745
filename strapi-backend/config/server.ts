export default ({ env }) => {
  // Generate APP_KEYS if not provided (for easy deployment)
  const generateAppKeys = () => {
    const crypto = require('crypto');
    return Array.from({ length: 4 }, () => crypto.randomBytes(32).toString('base64'));
  };

  const defaultKeys = env('APP_KEYS') 
    ? env.array('APP_KEYS') 
    : generateAppKeys();

  // Render automatically sets PORT env variable
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : env.int('PORT', 10000);
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: port,
    app: {
      keys: defaultKeys,
    },
    url: env('PUBLIC_URL', 'http://localhost:1337'),
    proxy: env.bool('PROXY', false),
  };
};
