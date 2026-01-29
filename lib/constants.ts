export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.EN;
