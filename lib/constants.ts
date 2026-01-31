// For production: Set NEXT_PUBLIC_STRAPI_URL and NEXT_PUBLIC_STRAPI_TOKEN in Vercel environment variables
// For local development: Fallback values are used if env vars are not set
export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '6fbdd1dd107e55abfca05fc9f746f04fd8e2739f1c7376032a0ac4703654257db16082ae3937da9b658395836017ed15e64c55c4b18f86c455fbbe3a89e203fbfc858ef5d9de2afa65cf6c9192c84dc6f0f248345791dc4cc9f144d392962e175ceaf5524c9e861dfb1ddb4c5a1899e63ce75f2f0dd14045dc0fe76d038e0732';

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.EN;
