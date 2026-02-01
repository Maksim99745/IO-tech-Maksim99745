import axios from "axios";
import { API_BASE_URL, API_TOKEN } from "@/lib/constants";
import { Service, TeamMember, Client, HeroContent } from "@/types";
import { filterByLocale } from "@/lib/utils/language";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token in every request
api.interceptors.request.use((config) => {
  if (API_TOKEN) {
    config.headers.Authorization = `Bearer ${API_TOKEN}`;
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("API Token:", API_TOKEN ? `${API_TOKEN.substring(0, 20)}...` : "NOT SET");
  }
  
  return config;
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
  // Strapi v5 returns data directly without attributes wrapper
  const data = item.attributes || item;
  
  let subsections: any[] | undefined = undefined;
  
  if (data.subsections) {
    subsections = Array.isArray(data.subsections) ? data.subsections : [];
  } else if (data.content) {
    try {
      const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      if (parsed && parsed.subsections) {
        subsections = parsed.subsections;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  // Handle image structure for Strapi v5
  let imageUrl = "";
  let imageAlt = "";
  
  if (data.image) {
    // Strapi v5 structure: can be data.image OR data.image.data OR data.image.data.attributes
    let imageData = data.image;
    
    // Unwrap nested structures
    if (imageData.data) {
      imageData = imageData.data;
    }
    if (imageData.attributes) {
      imageData = imageData.attributes;
    }
    
    if (imageData) {
      // URL is directly in the object: { url: "/uploads/...", formats: {...} }
      imageUrl = imageData.url || 
                 imageData.formats?.large?.url || 
                 imageData.formats?.medium?.url || 
                 imageData.formats?.small?.url || 
                 imageData.formats?.thumbnail?.url ||
                 "";
      
      imageAlt = imageData.alternativeText || 
                 imageData.caption || 
                 "";
      
      // Add base URL if it's a relative path (starts with /uploads/)
      if (imageUrl && !imageUrl.startsWith('http')) {
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        imageUrl = `${API_BASE_URL}${cleanUrl}`;
      }
      
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        if (!imageUrl) {
          console.warn("No image URL found for service:", data.title, "Image data:", data.image);
        }
      }
    }
  }
  
  return {
    id: item.id || item.documentId || data.id,
    slug: data.slug || item.slug || "",
    title: data.title || "",
    description: data.description || "",
    content: typeof data.content === 'string' && data.content.startsWith('{') 
      ? (() => {
          try {
            const parsed = JSON.parse(data.content);
            return parsed.footer || "";
          } catch {
            return data.content;
          }
        })()
      : data.content || "",
    image: imageUrl ? {
      url: imageUrl,
      alt: imageAlt,
    } : undefined,
    subsections: subsections ? subsections.map((sub: any) => ({
      title: sub.title || sub.attributes?.title || "",
      description: sub.description || sub.attributes?.description || "",
      items: sub.items || sub.attributes?.items || [],
    })) : undefined,
  };
};

const transformTeamMember = (item: any): TeamMember => {
  if (!item) {
    throw new Error("Item is null or undefined");
  }
  
  const data = item.attributes || item;
  
  if (!data) {
    throw new Error("Invalid team member data structure");
  }
  
  let imageUrl = "";
  let imageAlt = "";
  
  // Handle Strapi v5 image structure
  if (data.image) {
    // Strapi v5 can return: data.image.data.attributes OR data.image.data OR data.image (direct)
    let imageData = data.image;
    
    // Unwrap nested structures
    if (imageData.data) {
      imageData = imageData.data;
    }
    if (imageData.attributes) {
      imageData = imageData.attributes;
    }
    
    if (imageData) {
      // Try different possible URL paths (Strapi v5 structure)
      imageUrl = imageData.url || 
                 imageData.formats?.large?.url || 
                 imageData.formats?.medium?.url || 
                 imageData.formats?.small?.url || 
                 imageData.formats?.thumbnail?.url ||
                 "";
      
      imageAlt = imageData.alternativeText || 
                 imageData.caption || 
                 "";
      
      // Add base URL if it's a relative path
      if (imageUrl && !imageUrl.startsWith('http')) {
        // Ensure URL starts with / if it doesn't
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        imageUrl = `${API_BASE_URL}${cleanUrl}`;
      }
      
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        if (!imageUrl) {
          console.warn("No image URL found for team member:", data.name, "Image data:", data.image);
        } else {
          console.log("Team member image URL:", imageUrl);
        }
      }
    }
  }
  
  return {
    id: item.id || item.documentId || String(Math.random()),
    name: data.name || "Unknown",
    role: data.role || "",
    image: imageUrl ? {
      url: imageUrl,
      alt: imageAlt,
    } : undefined,
    whatsapp: data.whatsapp || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
  };
};

const transformClient = (item: any): Client => {
  const data = item.attributes || item;
  
  let imageUrl = "";
  let imageAlt = "";
  
  // Handle Strapi v5 image structure
  if (data.image) {
    // Strapi v5 can return: data.image.data.attributes OR data.image.data OR data.image (direct)
    let imageData = data.image;
    
    // Unwrap nested structures
    if (imageData.data) {
      imageData = imageData.data;
    }
    if (imageData.attributes) {
      imageData = imageData.attributes;
    }
    
    if (imageData) {
      // Try different possible URL paths (Strapi v5 structure)
      imageUrl = imageData.url || 
                 imageData.formats?.large?.url || 
                 imageData.formats?.medium?.url || 
                 imageData.formats?.small?.url || 
                 imageData.formats?.thumbnail?.url ||
                 "";
      
      imageAlt = imageData.alternativeText || 
                 imageData.caption || 
                 "";
      
      // Add base URL if it's a relative path
      if (imageUrl && !imageUrl.startsWith('http')) {
        // Ensure URL starts with / if it doesn't
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        imageUrl = `${API_BASE_URL}${cleanUrl}`;
      }
      
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        if (!imageUrl) {
          console.warn("No image URL found for team member:", data.name, "Image data:", data.image);
        } else {
          console.log("Team member image URL:", imageUrl);
        }
      }
    }
  }
  
  return {
    id: item.id || item.documentId || String(Math.random()),
    name: data.name || "",
    position: data.position || undefined,
    company: data.company || undefined,
    image: imageUrl ? {
      url: imageUrl,
      alt: imageAlt,
    } : undefined,
    testimonial: data.testimonial || undefined,
  };
};

const transformHeroContent = (item: any): HeroContent => {
  const data = item.attributes || item;
  
  // Handle Strapi v5 media structure
  // Structure can be: data.media OR data.media.data OR data.media.data.attributes
  let mediaUrl = "";
  let mediaAlt = "";
  
  if (data.media) {
    let mediaData = data.media;
    
    // Unwrap nested structures
    if (mediaData.data) {
      mediaData = mediaData.data;
    }
    if (mediaData.attributes) {
      mediaData = mediaData.attributes;
    }
    
    if (mediaData) {
      // URL is directly in the object: { url: "/uploads/...", formats: {...} }
      mediaUrl = mediaData.url || 
                 mediaData.formats?.large?.url || 
                 mediaData.formats?.medium?.url || 
                 mediaData.formats?.small?.url || 
                 mediaData.formats?.thumbnail?.url ||
                 "";
      
      mediaAlt = mediaData.alternativeText || 
                 mediaData.caption || 
                 "";
      
      // Add base URL if it's a relative path (starts with /uploads/)
      if (mediaUrl && !mediaUrl.startsWith('http')) {
        const cleanUrl = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`;
        mediaUrl = `${API_BASE_URL}${cleanUrl}`;
      }
    }
  }
  
  return {
    id: item.id || item.documentId || Math.random(),
    title: data.title || "",
    subtitle: data.subtitle,
    description: data.description,
    ctaText: data.ctaText,
    ctaLink: data.ctaLink,
    media: {
      type: data.mediaType || "image",
      url: mediaUrl,
      alt: mediaAlt,
    },
  };
};

export const strapiApi = {
  async getServices(locale: string = "en", page: number = 1, pageSize: number = 10) {
    try {
      const params: any = {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        populate: "*",
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/services", { params });
      const strapiData = response.data?.data || response.data || [];
      const transformed = Array.isArray(strapiData) ? strapiData.map(transformService) : [];
      
      const filtered = filterByLocale(transformed, locale, (service) => [
        service.title,
        service.description,
      ]);
      
      const originalPagination = response.data?.meta?.pagination || response.data?.pagination;
      const updatedPagination = originalPagination ? {
        ...originalPagination,
        total: filtered.length,
        pageCount: Math.ceil(filtered.length / pageSize),
      } : undefined;
      
      return {
        data: filtered,
        pagination: updatedPagination,
      };
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") {
        const axiosError = error as { response?: { data?: unknown } };
        console.error("Error fetching services:", error);
        console.error("Error response:", axiosError.response?.data);
      }
      throw error;
    }
  },

  async getServiceBySlug(slug: string, locale: string = "en") {
    try {
      const params: any = {
        "filters[slug][$eq]": slug,
        populate: "*",
      };
      
      // Only add locale if it's provided and not empty
      if (locale && locale.trim() !== '') {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/services", { params });
      const strapiData = response.data?.data || response.data || [];
      
      if (!Array.isArray(strapiData) || strapiData.length === 0) {
        return null;
      }
      
      const service = transformService(strapiData[0]);
      return service;
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") {
        const axiosError = error as { response?: { data?: unknown }; message?: string };
        console.error("Error fetching service by slug:", slug, error);
        console.error("Error response:", axiosError.response?.data);
        console.error("Error message:", axiosError.message);
      }
      // Return null instead of throwing to allow page to handle 404
      return null;
    }
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
          'pagination[pageSize]': 100,
        };
        
        if (locale) {
          params.locale = locale;
        }
        
        const response = await api.get<any>("/team-members", { params });
        const strapiData = response.data?.data || response.data || [];
        
        if (!Array.isArray(strapiData)) {
          return [];
        }
        
        const transformed = strapiData
          .filter((item: any) => item && (item.attributes || item))
          .map((item: any) => {
            try {
              return transformTeamMember(item);
            } catch (error) {
              if (process.env.NODE_ENV === "development") {
                console.error("Error transforming team member:", item, error);
              }
              return null;
            }
          })
          .filter((item: any) => item !== null) as TeamMember[];
        
        const filtered = filterByLocale(transformed, locale, (member) => [
          member.name,
          member.role,
        ]);
        
        return filtered;
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          const axiosError = error as { response?: { data?: unknown } };
          console.error("Error fetching team members:", error);
          console.error("Error response:", axiosError.response?.data);
        }
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
          'pagination[pageSize]': 100,
        };
        
        if (locale) {
          params.locale = locale;
        }
        
        const response = await api.get<any>("/clients", { params });
        const strapiData = response.data?.data || response.data || [];
        
        if (!Array.isArray(strapiData)) {
          return [];
        }
        
        const filtered = strapiData.filter((item: any) => {
          const data = item.attributes || item;
          const itemLocale = data.locale || item.locale || 'en';
          return itemLocale === locale;
        });
        
        const transformed = filtered.map((item: any) => {
          try {
            return transformClient(item);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Error transforming client:", item, error);
            }
            return null;
          }
        }).filter((item: any): item is Client => item !== null);
        
        const finalFiltered = filterByLocale(transformed, locale, (client) => [
          client.name,
          client.testimonial,
        ]);
        
        return finalFiltered;
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          const axiosError = error as { response?: { data?: unknown } };
          console.error("Error fetching clients:", error);
          console.error("Error response:", axiosError.response?.data);
        }
        throw error;
      }
    },

  async getHeroContent(locale: string = "en"): Promise<HeroContent[] | null> {
    try {
      // Strapi v5 uses query string format for nested populate
      const params: any = {
        'populate[media][populate]': '*',
        'pagination[pageSize]': 100,
      };
      
      if (locale) {
        params.locale = locale;
      }
      
      const response = await api.get<any>("/pages", { params });
      const strapiData = response.data?.data || response.data || [];
      
      if (!Array.isArray(strapiData) || strapiData.length === 0) {
        return null;
      }
      
      const transformed = strapiData
        .filter((item: any) => item && (item.attributes || item))
        .map((item: any) => {
          try {
            return transformHeroContent(item);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Error transforming hero content:", item, error);
            }
            return null;
          }
        })
        .filter((item: any) => item !== null && item.title) as HeroContent[];
      
      if (transformed.length === 0) {
        return null;
      }
      
      const filtered = filterByLocale(transformed, locale, (content) => [
        content.title,
        content.subtitle,
        content.description,
      ]);
      
      if (filtered.length === 0) {
        return null;
      }
      
      return filtered;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
      console.error("Error fetching hero content:", error);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error response:", axiosError.response?.data || axiosError.message);
      console.error("API URL:", `${API_BASE_URL}/api/pages`);
      console.error("API Token:", API_TOKEN ? `${API_TOKEN.substring(0, 20)}...` : "NOT SET");
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
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error subscribing email:", error);
      }
      throw error;
    }
  },
};
