import axios from "axios";
import { API_BASE_URL, API_TOKEN } from "@/lib/constants";
import { Service, TeamMember, Client, HeroContent } from "@/types";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    ...(API_TOKEN && {
      Authorization: `Bearer ${API_TOKEN}`,
    }),
  },
});

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

const transformService = (item: any): Service => {
  // Strapi v5 может использовать другой формат
  // Проверяем оба варианта: v4 (attributes) и v5 (прямые поля)
  const data = item.attributes || item;
  
  return {
    id: item.id,
    slug: data.slug,
    title: data.title,
    description: data.description || "",
    content: data.content || "",
    image: data.image?.data || data.image
      ? {
          url: data.image?.data?.attributes?.url 
            ? `${API_BASE_URL}${data.image.data.attributes.url}`
            : data.image?.url || data.image?.attributes?.url || "",
          alt: data.image?.data?.attributes?.alternativeText || data.image?.alternativeText || "",
        }
      : undefined,
  };
};

const transformTeamMember = (item: any): TeamMember => ({
  id: item.id,
  name: item.attributes.name,
  role: item.attributes.role,
  image: item.attributes.image?.data
    ? {
        url: `${API_BASE_URL}${item.attributes.image.data.attributes.url}`,
        alt: item.attributes.image.data.attributes.alternativeText || "",
      }
    : undefined,
  whatsapp: item.attributes.whatsapp || undefined,
  phone: item.attributes.phone || undefined,
  email: item.attributes.email || undefined,
});

const transformClient = (item: any): Client => ({
  id: item.id,
  name: item.attributes.name,
  position: item.attributes.position || undefined,
  company: item.attributes.company || undefined,
  image: item.attributes.image?.data
    ? {
        url: `${API_BASE_URL}${item.attributes.image.data.attributes.url}`,
        alt: item.attributes.image.data.attributes.alternativeText || "",
      }
    : undefined,
  testimonial: item.attributes.testimonial || undefined,
});

const transformHeroContent = (item: any): HeroContent => ({
  id: item.id,
  title: item.attributes.title,
  subtitle: item.attributes.subtitle || undefined,
  description: item.attributes.description || undefined,
  ctaText: item.attributes.ctaText || undefined,
  ctaLink: item.attributes.ctaLink || undefined,
  media: {
    type: item.attributes.mediaType || "image",
    url: item.attributes.media?.data
      ? `${API_BASE_URL}${item.attributes.media.data.attributes.url}`
      : "",
    alt: item.attributes.media?.data?.attributes?.alternativeText || undefined,
  },
});

export const strapiApi = {
  async getServices(locale: string = "en", page: number = 1, pageSize: number = 10) {
    try {
      // Strapi v5: locale передается как отдельный параметр, не через filters
      const params: any = {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        populate: "*",
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/services", { params });
      
      // Strapi v4/v5 формат: { data: [...], meta: {...} }
      const strapiData = response.data?.data || response.data || [];
      
      return {
        data: Array.isArray(strapiData) ? strapiData.map(transformService) : [],
        pagination: response.data?.meta?.pagination || response.data?.pagination,
      };
    } catch (error: any) {
      console.error("Error fetching services:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  async getServiceBySlug(slug: string, locale: string = "en") {
    const params: any = {
      "filters[slug][$eq]": slug,
      populate: "*",
    };
    
    if (locale) {
      params.locale = locale;
    }
    
    const response = await api.get<any>("/services", { params });
    const strapiData = response.data?.data || response.data || [];
    
    if (!Array.isArray(strapiData) || strapiData.length === 0) {
      return null;
    }
    return transformService(strapiData[0]);
  },

  async searchServices(query: string, locale: string = "en", page: number = 1, pageSize: number = 10) {
    const params: any = {
      "filters[$or][0][title][$containsi]": query,
      "filters[$or][1][description][$containsi]": query,
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      populate: "*",
    };
    
    if (locale) {
      params.locale = locale;
    }
    
    const response = await api.get<any>("/services", { params });
    const strapiData = response.data?.data || response.data || [];
    
    return {
      data: Array.isArray(strapiData) ? strapiData.map(transformService) : [],
      pagination: response.data?.meta?.pagination || response.data?.pagination,
    };
  },

  async getTeamMembers(locale: string = "en") {
    try {
      const params: any = {
        populate: "*",
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/team-members", { params });
      const strapiData = response.data?.data || response.data || [];
      return Array.isArray(strapiData) ? strapiData.map(transformTeamMember) : [];
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  async searchTeamMembers(query: string, locale: string = "en", page: number = 1, pageSize: number = 10) {
    const params: any = {
      "filters[$or][0][name][$containsi]": query,
      "filters[$or][1][role][$containsi]": query,
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      populate: "*",
    };
    
    if (locale) {
      params.locale = locale;
    }
    
    const response = await api.get<any>("/team-members", { params });
    const strapiData = response.data?.data || response.data || [];
    
    return {
      data: Array.isArray(strapiData) ? strapiData.map(transformTeamMember) : [],
      pagination: response.data?.meta?.pagination || response.data?.pagination,
    };
  },

  async getClients(locale: string = "en") {
    try {
      const params: any = {
        populate: "*",
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/clients", { params });
      const strapiData = response.data?.data || response.data || [];
      return Array.isArray(strapiData) ? strapiData.map(transformClient) : [];
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  async getHeroContent(locale: string = "en"): Promise<HeroContent[] | null> {
    try {
      const params: any = {
        populate: "*",
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/pages", { params });
      const strapiData = response.data?.data || response.data || [];
      
      if (!Array.isArray(strapiData) || strapiData.length === 0) {
        return null;
      }
      return strapiData.map(transformHeroContent);
    } catch (error: any) {
      console.error("Error fetching hero content:", error);
      return null;
    }
  },

  async subscribeEmail(email: string) {
    try {
      // Strapi v5 формат: { data: { email: ... } }
      const response = await api.post("/subscribers", {
        data: {
          email,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error subscribing email:", error);
      throw error;
    }
  },
};
