#!/usr/bin/env node

/**
 * Generate Strapi secrets for deployment
 * Run this script to generate all required secrets
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

const secrets = {
  APP_KEYS: Array.from({ length: 4 }, () => generateSecret(32)).join(','),
  ADMIN_JWT_SECRET: generateSecret(32),
  API_TOKEN_SALT: generateSecret(32),
  TRANSFER_TOKEN_SALT: generateSecret(32),
  JWT_SECRET: generateSecret(32),
};

console.log('Generated Strapi secrets:');
console.log('');
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('');
console.log('Copy these to Render Dashboard → Environment Variables');
