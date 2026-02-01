import crypto from 'crypto';

function generateJWTSecret() {
  return crypto.randomBytes(32).toString('base64');
}

export default ({ env }) => ({
  'users-permissions': {
    jwtSecret: env('JWT_SECRET', generateJWTSecret()),
  },
});
