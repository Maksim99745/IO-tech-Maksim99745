export type Language = 'en' | 'ar';

export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: {
    url: string;
    alt: string;
  };
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image?: {
    url: string;
    alt: string;
  };
  whatsapp?: string;
  phone?: string;
  email?: string;
}

export interface Client {
  id: number;
  name: string;
  position?: string;
  company?: string;
  image?: {
    url: string;
    alt: string;
  };
  testimonial?: string;
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}
