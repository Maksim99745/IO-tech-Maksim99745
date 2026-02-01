export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '289d740187fa0d03c8654745ee4a584d9af62f75bec42f0fb7a0ec95a66c1b0897892e396b5e45c6e29236323d1dfff71840efbea7a1a4b39268fbbc3449187edaf0034264e55e2b91e0199a212b4810f6abbf454f5d2c729a794dac8e7a9b4980036f10a62ae4de8e04a0d59762eb4ad41bb01c78d842f8d5a8901abbcf02ad';

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.EN;

// Fallback images from local assets (if Strapi media is unavailable)
export const FALLBACK_IMAGES = {
  team: [
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
  ],
  client: [
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
  ],
  hero: [
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
    '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg',
    '/assets/Image (6).png',
  ],
  service: '/assets/Home  bg image.png',
};
