export default ({ env }) => {
  // Generate secrets if not provided (for easy deployment)
  const generateSecret = () => {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('base64');
  };

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET', generateSecret()),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT', generateSecret()),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT', generateSecret()),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY', generateSecret()),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
  };
};
