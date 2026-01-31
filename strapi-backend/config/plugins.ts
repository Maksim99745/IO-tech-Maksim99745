export default ({ env }) => {
  // Generate JWT secret if not provided (for easy deployment)
  const generateJWTSecret = () => {
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('base64');
  };

  return {
    'users-permissions': {
      jwtSecret: env('JWT_SECRET', generateJWTSecret()),
    },
  };
};
