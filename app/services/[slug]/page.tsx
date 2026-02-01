import { notFound } from "next/navigation";
import { Metadata } from "next";
import { strapiApi } from "@/lib/api/strapi";
import { Service } from "@/types";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";
import ServiceDetailClient from "./ServiceDetailClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
  searchParams: Promise<{
    locale?: string;
  }> | {
    locale?: string;
  };
}

async function getService(slug: string, locale: string = "en"): Promise<Service | null> {
  try {
    // Try to get service with locale-specific slug first
    let service = await strapiApi.getServiceBySlug(slug, locale);
    
    // If not found and locale is 'ar', try with '-ar' suffix
    if (!service && locale === 'ar') {
      service = await strapiApi.getServiceBySlug(`${slug}-ar`, locale);
    }
    
    // If still not found, try without locale filter
    if (!service) {
      service = await strapiApi.getServiceBySlug(slug, '');
    }
    
    return service;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching service:", error);
    }
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolvedSearchParams.locale || "en";
  const service = await getService(resolvedParams.slug, locale);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | IO Tech`,
    description: service.description || service.title,
    openGraph: {
      title: service.title,
      description: service.description || service.title,
      images: service.image ? [service.image.url] : [],
    },
  };
}

// Removed generateStaticParams - using dynamic rendering instead

export default async function ServiceDetailPage({ params, searchParams }: PageProps) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const locale = resolvedSearchParams.locale || "en";
    // Decode slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    const service = await getService(decodedSlug, locale);

    if (!service) {
      notFound();
    }

    return (
      <ServiceDetailClient service={service} locale={locale} />
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in ServiceDetailPage:", error);
    }
    notFound();
  }
}
