import crypto from 'crypto';

function generateAppKeys() {
  return Array.from({ length: 4 }, () => 
    crypto.randomBytes(32).toString('base64')
  );
}

export default ({ env }) => {
  const appKeysEnv = env('APP_KEYS');
  const appKeys = appKeysEnv 
    ? env.array('APP_KEYS') 
    : generateAppKeys();
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : env.int('PORT', 1337),
    app: {
      keys: appKeys,
    },
  };
};
