"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { HeroContent } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const locale = currentLanguage || i18n.language || "en";
        const content = await strapiApi.getHeroContent(locale);
        if (content && content.length > 0) {
          setHeroContent(content[0]);
        }
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, [currentLanguage, i18n.language]);

  if (loading) {
    return (
      <section className="relative min-h-[600px] bg-brown-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  if (!heroContent) {
    return null;
  }

  return (
    <section className="relative min-h-[600px] bg-brown-dark overflow-hidden">
      {heroContent.media.url && (
        <div className="absolute inset-0 z-0">
          {heroContent.media.type === "video" ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-50"
            >
              <source src={heroContent.media.url} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroContent.media.url}
              alt={heroContent.media.alt || heroContent.title}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6 md:px-24 py-20 md:py-32">
        <div className="max-w-2xl">
          {heroContent.subtitle && (
            <p className="text-brown-light text-lg md:text-xl mb-4 font-medium">
              {heroContent.subtitle}
            </p>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brown-dark mb-6 leading-tight">
            {heroContent.title}
          </h1>

          {heroContent.description && (
            <p className="text-brown-dark text-base md:text-lg mb-8 leading-relaxed">
              {heroContent.description}
            </p>
          )}

          {heroContent.ctaText && heroContent.ctaLink && (
            <Link
              href={heroContent.ctaLink}
              className="inline-block text-brown-dark underline font-medium text-lg hover:text-brown-light transition-colors"
            >
              {heroContent.ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
