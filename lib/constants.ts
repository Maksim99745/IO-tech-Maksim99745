export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || 'e5bd95d1b27c948649e3a315dbc0344c9ed8274b4025f5b193523eb908ac0aa2a64ad1e42c167a29686d308cefcf2d22bafbd3b9f3caa49b2ec54caba951e2b01e9af306ba708aa140cc12bae02ca6cc07cdac229b66da856582ce2f370e916c399cf4dd5a214e5bac1865d410c8bb1b7071df0605ad736a26b8525c515ed43c';

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
    '/assets/Home  bg image.png',
    '/assets/Home  bg image.png',
    '/assets/Home  bg image.png',
    '/assets/Home  bg image.png',
    '/assets/Home  bg image.png',
  ],
  service: '/assets/Home  bg image.png',
};
