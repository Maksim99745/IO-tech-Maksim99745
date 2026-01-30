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
  
  let subsections: any[] | undefined = undefined;
  
  // Пытаемся получить subsections из разных источников
  if (data.subsections) {
    subsections = Array.isArray(data.subsections) ? data.subsections : [];
  } else if (data.content) {
    // Пытаемся распарсить JSON из content
    try {
      const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      if (parsed && parsed.subsections) {
        subsections = parsed.subsections;
      }
    } catch (e) {
      // Если не JSON, игнорируем
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
    console.error("Item is null or undefined");
    throw new Error("Item is null or undefined");
  }
  
  // Strapi v5 может использовать прямой формат или attributes
  const data = item.attributes || item;
  
  if (!data) {
    console.error("Invalid team member data:", item);
    throw new Error("Invalid team member data structure");
  }
  
  if (!data.name && !data.role) {
    console.error("Team member missing name and role:", data);
  }
  
  return {
    id: item.id || item.documentId || String(Math.random()),
    name: data.name || "Unknown",
    role: data.role || "",
    image: data.image?.data || data.image
      ? {
          url: data.image?.data?.attributes?.url 
            ? `${API_BASE_URL}${data.image.data.attributes.url}`
            : data.image?.url || data.image?.attributes?.url || "",
          alt: data.image?.data?.attributes?.alternativeText || data.image?.alternativeText || "",
        }
      : undefined,
    whatsapp: data.whatsapp || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
  };
};

const transformClient = (item: any): Client => {
  const data = item.attributes || item;
  return {
    id: item.id || item.documentId || String(Math.random()),
    name: data.name || "",
    position: data.position || undefined,
    company: data.company || undefined,
    image: data.image?.data
      ? {
          url: `${API_BASE_URL}${data.image.data.attributes.url}`,
          alt: data.image.data.attributes.alternativeText || "",
        }
      : data.image?.attributes
      ? {
          url: `${API_BASE_URL}${data.image.attributes.url}`,
          alt: data.image.attributes.alternativeText || "",
        }
      : undefined,
    testimonial: data.testimonial || undefined,
  };
};

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
              console.error("Error transforming team member:", item, error);
              return null;
            }
          })
          .filter((item: any) => item !== null) as TeamMember[];
        
        // Дополнительная фильтрация по арабским символам, если локализация не работает
        const arabicRegex = /[\u0600-\u06FF]/;
        const filtered = transformed.filter((member: TeamMember) => {
          const hasArabicInName = member.name && arabicRegex.test(member.name);
          const hasArabicInRole = member.role && arabicRegex.test(member.role);
          const hasArabic = hasArabicInName || hasArabicInRole;
          
          if (locale === 'en') {
            // Для английского: исключаем записи с арабскими символами
            return !hasArabic;
          }
          if (locale === 'ar') {
            // Для арабского: показываем записи с арабскими символами
            return hasArabic;
          }
          return true;
        });
        
        return filtered;
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
        
        // Дополнительная фильтрация на клиенте, если Strapi не отфильтровал правильно
        const filtered = strapiData.filter((item: any) => {
          const data = item.attributes || item;
          const itemLocale = data.locale || item.locale || 'en';
          return itemLocale === locale;
        });
        
        const transformed = filtered.map((item: any) => {
          try {
            return transformClient(item);
          } catch (error) {
            console.error("Error transforming client:", item, error);
            return null;
          }
        }).filter((item: any) => item !== null);
        
        // Дополнительная фильтрация по арабским символам
        const finalFiltered = transformed.filter((client: Client) => {
          const arabicRegex = /[\u0600-\u06FF]/;
          const englishRegex = /[a-zA-Z]/;
          
          const hasArabicInName = client.name && arabicRegex.test(client.name);
          const hasArabicInTestimonial = client.testimonial && arabicRegex.test(client.testimonial);
          const hasArabic = hasArabicInName || hasArabicInTestimonial;
          
          const hasEnglishInName = client.name && englishRegex.test(client.name);
          const hasEnglishInTestimonial = client.testimonial && englishRegex.test(client.testimonial);
          const hasEnglish = hasEnglishInName || hasEnglishInTestimonial;
          
          if (locale === 'en') {
            // Для английского: исключаем записи с арабскими символами
            return !hasArabic;
          }
          if (locale === 'ar') {
            // Для арабского: показываем записи с арабскими символами
            // Если есть арабские символы - показываем
            if (hasArabic) return true;
            // Если нет арабских символов - не показываем
            return false;
          }
          return true;
        });
        
        return finalFiltered;
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
