export default ({ env }) => {
  // Generate APP_KEYS if not provided (for easy deployment)
  const generateAppKeys = () => {
    const crypto = require('crypto');
    return Array.from({ length: 4 }, () => crypto.randomBytes(32).toString('base64'));
  };

  const defaultKeys = env('APP_KEYS') 
    ? env.array('APP_KEYS') 
    : generateAppKeys();

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: defaultKeys,
    },
    url: env('PUBLIC_URL', 'http://localhost:1337'),
    proxy: env.bool('PROXY', false),
  };
};
