import { notFound } from "next/navigation";
import { Metadata } from "next";
import { strapiApi } from "@/lib/api/strapi";
import { Service } from "@/types";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";
import ServiceDetailClient from "./ServiceDetailClient";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    locale?: string;
  };
}

async function getService(slug: string, locale: string = "en"): Promise<Service | null> {
  try {
    return await strapiApi.getServiceBySlug(slug, locale);
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const locale = searchParams.locale || "en";
  const service = await getService(params.slug, locale);

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

export async function generateStaticParams() {
  try {
    const result = await strapiApi.getServices("en", 1, 100);
    return result.data.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ServiceDetailPage({ params, searchParams }: PageProps) {
  const locale = searchParams.locale || "en";
  const service = await getService(params.slug, locale);

  if (!service) {
    notFound();
  }

  return (
    <ServiceDetailClient service={service} locale={locale} />
  );
}
