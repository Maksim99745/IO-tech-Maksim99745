export default ({ env }) => {
  // Generate JWT secret if not provided (for easy deployment)
  const crypto = require('crypto');
  const generateJWTSecret = () => {
    return crypto.randomBytes(16).toString('base64');
  };

  // Check if JWT_SECRET is set and not empty
  const jwtSecretEnv = env('JWT_SECRET');
  const jwtSecret = jwtSecretEnv && jwtSecretEnv.trim() !== '' 
    ? jwtSecretEnv 
    : generateJWTSecret();

  return {
    'users-permissions': {
      jwtSecret: jwtSecret,
    },
  };
};
