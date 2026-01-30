"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { Service } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ServicesList() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const locale = currentLanguage || i18n.language || "en";
        const result = await strapiApi.getServices(locale, 1, 6);
        setServices(result.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentLanguage, i18n.language]);

  if (loading) {
    return (
      <section id="services" className="bg-black py-16">
        <div className="container mx-auto px-6 md:px-24">
          <div className="text-center text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("nav.services")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group"
            >
              {service.image && (
                <div className="relative w-full h-48 bg-gray-800">
                  <Image
                    src={service.image.url}
                    alt={service.image.alt || service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brown-light transition-colors">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-gray-300 line-clamp-3 mb-4">
                    {service.description}
                  </p>
                )}
                <span className="text-brown-light font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t("common.readMore")}
                  <svg
                    className="w-4 h-4 rtl:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
