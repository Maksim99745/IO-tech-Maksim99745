"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { HeroContent } from "@/types";
import { API_BASE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [heroContents, setHeroContents] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const locale = currentLanguage || i18n.language || "en";
        const contents = await strapiApi.getHeroContent(locale);
        if (contents && contents.length > 0) {
          setHeroContents(contents);
        } else {
          setHeroContents([]);
        }
      } catch (error: any) {
        console.error("Failed to fetch hero content:", error);
        console.error("Error details:", error.response?.data || error.message);
        console.error("API URL:", process.env.NEXT_PUBLIC_STRAPI_URL || "NOT SET");
        setError(error.message || "Failed to load hero content");
        setHeroContents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, [currentLanguage, i18n.language]);

  useEffect(() => {
    if (heroContents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroContents.length]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && heroContents[currentIndex]?.media.type === 'video') {
      currentVideo.play().catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Error playing video:", err);
        }
      });
    }

    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[Number(key)];
      if (video && Number(key) !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, heroContents]);

  if (loading) {
    return (
      <section className="relative flex-1 bg-transparent flex items-center justify-center w-full">
        <div className="relative z-20 text-center px-6">
          <div className="text-white text-xl mb-3 font-medium">
            {t("common.serverLoading")}
          </div>
          <div className="text-white/80 text-sm max-w-2xl">
            {t("common.serverLoadingNote")}
          </div>
        </div>
      </section>
    );
  }

  const currentContent = heroContents.length > 0 ? heroContents[currentIndex] : null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroContents.length) % heroContents.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroContents.length);
  };

  const getCtaLink = (ctaLink?: string) => {
    if (!ctaLink) return "#";
    if (ctaLink.startsWith("http://") || ctaLink.startsWith("https://")) {
      return ctaLink;
    }
    return ctaLink;
  };

  const isExternalLink = (link: string) => {
    return link.startsWith("http://") || link.startsWith("https://");
  };

  return (
    <section className="relative flex-1 bg-transparent overflow-hidden w-full">
      {currentContent ? (
        <div className="relative z-20 h-full flex items-start">
          <div className="container mx-auto px-6 md:px-24 w-full">
            <div className="flex items-start gap-8">
              <div className="flex items-start gap-[109px]">
                {heroContents.length > 1 && (
                  <div className="flex flex-col items-center pt-[294px]">
                    <button
                      onClick={nextSlide}
                      className="w-[12px] h-[35px] flex items-center justify-center text-white text-[30px] leading-[100%] text-center mb-[88px] font-[FontAwesome] font-normal tracking-normal hover:opacity-70 transition-opacity"
                      aria-label="Next slide"
                    >
                      <Image
                        src="/assets/fa-angle-left.svg"
                        alt="Next"
                        width={10}
                        height={17}
                        className="w-full h-full"
                      />
                    </button>

                    <div className="flex flex-col items-center gap-2">
                      {heroContents.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? "bg-white"
                              : "bg-transparent border border-white hover:bg-white/20"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col pt-[298px]">
                  <h1 className="text-[40px] leading-[48px] text-white mb-[35px]">
                    {currentContent.title}
                  </h1>
                  
                  {currentContent.description && (
                    <p className="text-[18px] leading-[28px] font-medium text-white mb-[76px] max-w-[700px]">
                      {currentContent.description}
                    </p>
                  )}

                  {currentContent.ctaText && currentContent.ctaLink && (
                    isExternalLink(currentContent.ctaLink) ? (
                      <a
                        href={getCtaLink(currentContent.ctaLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-[161px] h-[60px] bg-white rounded-[12px] flex items-center justify-center hover:opacity-90 transition-opacity font-medium text-lg leading-[26px] text-[#4B2615] text-center"
                      >
                        {currentContent.ctaText}
                      </a>
                    ) : (
                      <Link
                        href={getCtaLink(currentContent.ctaLink)}
                        className="relative w-[161px] h-[60px] bg-white rounded-[12px] flex items-center justify-center hover:opacity-90 transition-opacity font-medium text-lg leading-[26px] text-[#4B2615] text-center"
                      >
                        {currentContent.ctaText}
                      </Link>
                    )
                  )}
                </div>
              </div>

              <div className="relative w-[374px] h-[374px] min-w-[374px] bg-[#643F2E] rounded-lg overflow-hidden ml-auto mt-[235px] flex-shrink-0">
                {currentContent.media.type === 'video' && currentContent.media.url ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[currentIndex] = el;
                    }}
                    src={currentContent.media.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                      // If video fails, show fallback image
                      const video = e.currentTarget;
                      video.style.display = 'none';
                      const img = document.createElement('img');
                      const fallbackImages = ['/assets/Image (6).png', '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg'];
                      img.src = fallbackImages[currentIndex % fallbackImages.length];
                      img.alt = currentContent.media.alt || currentContent.title;
                      img.className = 'w-full h-full object-cover';
                      video.parentElement?.appendChild(img);
                    }}
                  />
                ) : (
                  <img
                    src={(() => {
                      const fallbackImages = ['/assets/Image (6).png', '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg'];
                      const fallbackUrl = fallbackImages[currentIndex % fallbackImages.length];
                      const mediaUrl = currentContent.media.url;
                      // Check if media URL is valid, otherwise use fallback immediately
                      if (!mediaUrl || !mediaUrl.startsWith('http') || mediaUrl.includes('undefined') || mediaUrl.includes('null')) {
                        return fallbackUrl;
                      }
                      return mediaUrl;
                    })()}
                    alt={currentContent.media.alt || currentContent.title}
                    className="w-full h-full object-cover"
                    style={{ minWidth: '374px', minHeight: '374px' }}
                    onError={(e) => {
                      // If image fails to load, use fallback
                      const target = e.currentTarget;
                      const fallbackImages = ['/assets/Image (6).png', '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg'];
                      const fallbackUrl = fallbackImages[currentIndex % fallbackImages.length];
                      if (!target.src.includes('/assets/Image (6).png') && !target.src.includes('/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg')) {
                        target.src = fallbackUrl;
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <div className="text-white text-xl mb-4 font-semibold">
              {error ? "Content loading error" : "Content not found"}
            </div>
            {error && (
              <div className="text-brown-light text-sm mb-4 bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                <p className="font-medium mb-2">Error: {error}</p>
                <p className="text-xs opacity-80">
                  Make sure Strapi CMS is running and accessible at: {API_BASE_URL}
                </p>
              </div>
            )}
            <div className="text-brown-light text-sm space-y-2">
              <p className="font-medium">To display hero section you need to:</p>
              <ol className="list-decimal list-inside text-left space-y-1 text-xs opacity-90 max-w-md mx-auto">
                <li>Open Strapi Admin panel</li>
                <li>Go to &quot;Page&quot; collection (Pages)</li>
                <li>Create a new entry with fields:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                    <li>Title (required)</li>
                    <li>Subtitle (optional)</li>
                    <li>Description (optional)</li>
                    <li>CTA Text (button text)</li>
                    <li>CTA Link (button link)</li>
                    <li>Media (image or video)</li>
                    <li>Media Type (image or video)</li>
                  </ul>
                </li>
                <li>Save and publish the entry</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
