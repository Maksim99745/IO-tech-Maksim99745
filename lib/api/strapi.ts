import axios from "axios";
import { API_BASE_URL, API_TOKEN } from "@/lib/constants";
import { Service, TeamMember, Client, HeroContent } from "@/types";
import { filterByLocale } from "@/lib/utils/language";

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
  
  return {
    id: item.id,
    slug: data.slug,
    title: data.title,
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
    image: data.image?.data || data.image
      ? {
          url: data.image?.data?.attributes?.url 
            ? `${API_BASE_URL}${data.image.data.attributes.url}`
            : data.image?.url || data.image?.attributes?.url || "",
          alt: data.image?.data?.attributes?.alternativeText || data.image?.alternativeText || "",
        }
      : undefined,
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
  
  if (data.image?.data || data.image) {
    if (data.image?.data?.attributes?.url) {
      imageUrl = data.image.data.attributes.url.startsWith('http') 
        ? data.image.data.attributes.url 
        : `${API_BASE_URL}${data.image.data.attributes.url}`;
      imageAlt = data.image.data.attributes.alternativeText || "";
    } else if (data.image?.url) {
      imageUrl = data.image.url.startsWith('http') 
        ? data.image.url 
        : `${API_BASE_URL}${data.image.url}`;
      imageAlt = data.image.alternativeText || "";
    } else if (data.image?.attributes?.url) {
      imageUrl = data.image.attributes.url.startsWith('http') 
        ? data.image.attributes.url 
        : `${API_BASE_URL}${data.image.attributes.url}`;
      imageAlt = data.image.attributes.alternativeText || "";
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
  
  if (data.image?.data || data.image) {
    if (data.image?.data?.attributes?.url) {
      imageUrl = data.image.data.attributes.url.startsWith('http') 
        ? data.image.data.attributes.url 
        : `${API_BASE_URL}${data.image.data.attributes.url}`;
      imageAlt = data.image.data.attributes.alternativeText || "";
    } else if (data.image?.url) {
      imageUrl = data.image.url.startsWith('http') 
        ? data.image.url 
        : `${API_BASE_URL}${data.image.url}`;
      imageAlt = data.image.alternativeText || "";
    } else if (data.image?.attributes?.url) {
      imageUrl = data.image.attributes.url.startsWith('http') 
        ? data.image.attributes.url 
        : `${API_BASE_URL}${data.image.attributes.url}`;
      imageAlt = data.image.attributes.alternativeText || "";
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
  const media = data.media?.data?.attributes || data.media?.data || data.media?.attributes || data.media;
  const mediaUrl = media?.url ? (media.url.startsWith('http') ? media.url : `${API_BASE_URL}${media.url}`) : "";
  
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
      alt: media?.alternativeText,
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
      
      // Don't send locale param to Strapi - we filter client-side
      // if (locale) {
      //   params.locale = locale;
      // }
      
      const response = await api.get<any>("/services", { params });
      const strapiData = response.data?.data || response.data || [];
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[Strapi API] Fetched ${strapiData.length} services from API`);
      }
      
      const transformed = Array.isArray(strapiData) ? strapiData.map(transformService) : [];
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[Strapi API] Transformed ${transformed.length} services`);
      }
      
      const filtered = filterByLocale(transformed, locale, (service) => [
        service.title,
        service.description,
      ]);
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[Strapi API] Filtered to ${filtered.length} services for locale "${locale}"`);
        if (filtered.length === 0 && transformed.length > 0) {
          console.warn(`[Strapi API] All services were filtered out! Check filterByLocale logic.`);
          console.log(`[Strapi API] Sample service titles:`, transformed.slice(0, 3).map(s => s.title));
        }
      }
      
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
        const axiosError = error as { response?: { data?: unknown }; message?: string };
        console.error("Error fetching services:", error);
        console.error("Error message:", axiosError.message);
        console.error("Error response:", axiosError.response?.data);
        console.error("API URL:", `${API_BASE_URL}/api/services`);
      }
      // Return empty data instead of throwing to prevent component crash
      return {
        data: [],
        pagination: undefined,
      };
    }
  },

  async getServiceBySlug(slug: string, locale: string = "en") {
    // Try both slug and slug-ar for Arabic
    const slugsToTry = locale === "ar" 
      ? [slug, `${slug}-ar`, slug.replace(/-ar$/, "")] 
      : [slug, slug.replace(/-ar$/, "")];
    
    for (const slugToTry of slugsToTry) {
      const params: any = {
        "filters[slug][$eq]": slugToTry,
        populate: "*",
      };
      
      try {
        const response = await api.get<any>("/services", { params });
        const strapiData = response.data?.data || response.data || [];
        
        if (!Array.isArray(strapiData) || strapiData.length === 0) {
          continue; // Try next slug
        }
        
        // Transform all found services
        const transformed = strapiData.map(transformService);
        
        // Filter by locale
        const filtered = filterByLocale(transformed, locale, (service) => [
          service.title,
          service.description,
        ]);
        
        if (filtered.length > 0) {
          if (process.env.NODE_ENV === "development") {
            console.log(`[Strapi API] Found service with slug "${slugToTry}" for locale "${locale}"`);
          }
          return filtered[0];
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Error fetching service with slug "${slugToTry}":`, error);
        }
        continue; // Try next slug
      }
    }
    
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Strapi API] Service not found for slug "${slug}" and locale "${locale}"`);
    }
    return null;
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
        
        // Don't send locale param to Strapi - we filter client-side
        // if (locale) {
        //   params.locale = locale;
        // }
        
        const response = await api.get<any>("/team-members", { params });
        const strapiData = response.data?.data || response.data || [];
        
        if (process.env.NODE_ENV === "development") {
          console.log(`[Strapi API] Fetched ${strapiData.length} team members from API`);
        }
        
        if (!Array.isArray(strapiData)) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[Strapi API] Response is not an array:", strapiData);
          }
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
        
        if (process.env.NODE_ENV === "development") {
          console.log(`[Strapi API] Transformed ${transformed.length} team members`);
        }
        
        const filtered = filterByLocale(transformed, locale, (member) => [
          member.name,
          member.role,
        ]);
        
        if (process.env.NODE_ENV === "development") {
          console.log(`[Strapi API] Filtered to ${filtered.length} team members for locale "${locale}"`);
        }
        
        return filtered;
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          const axiosError = error as { response?: { data?: unknown }; message?: string };
          console.error("Error fetching team members:", error);
          console.error("Error message:", axiosError.message);
          console.error("Error response:", axiosError.response?.data);
          console.error("API URL:", `${API_BASE_URL}/api/team-members`);
        }
        // Return empty array instead of throwing to prevent component crash
        return [];
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
      const params: any = {
        populate: {
          media: {
            populate: "*",
          },
        },
        "pagination[pageSize]": 100,
      };
      
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
      if (process.env.NODE_ENV === "development") {
        const axiosError = error as { response?: { data?: unknown }; message?: string };
        console.error("Error fetching hero content:", error);
        console.error("Error response:", axiosError.response?.data || axiosError.message);
      }
      return null;
    }
  },

  async subscribeEmail(email: string) {
    try {
      // Strapi v5 format: { data: { email: ... } }
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
