"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { Service } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ServiceDetailClientProps {
  service: Service;
  locale?: string;
}

export default function ServiceDetailClient({ service, locale }: ServiceDetailClientProps) {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);

  useEffect(() => {
    const lang = locale || currentLanguage || i18n.language || "en";
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [locale, currentLanguage, i18n]);

  return (
    <article className="container mx-auto px-6 md:px-24 py-12 md:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brown-light hover:text-white mb-8 transition-colors"
      >
        <svg
          className="w-5 h-5 rtl:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>{t("service.back")}</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        {service.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden bg-gray-800">
            <Image
              src={service.image.url}
              alt={service.image.alt || service.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
          {service.description && (
            <p className="text-xl text-gray-300 leading-relaxed">
              {service.description}
            </p>
          )}
        </header>

        {service.content && (
          <div
            className="prose prose-invert prose-lg max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        )}

        {!service.content && service.description && (
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p className="text-lg leading-relaxed">{service.description}</p>
          </div>
        )}
      </div>
    </article>
  );
}
