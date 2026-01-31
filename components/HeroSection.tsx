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
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch hero content:", error);
        }
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
        <div className="relative z-20 text-white text-xl">Loading...</div>
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
                {currentContent.media.url ? (
                  currentContent.media.type === 'video' ? (
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
                        if (process.env.NODE_ENV === "development") {
                          console.error("Error loading video:", currentContent.media.url, e);
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={currentContent.media.url}
                      alt={currentContent.media.alt || currentContent.title}
                      className="w-full h-full object-cover"
                      style={{ minWidth: '374px', minHeight: '374px' }}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (process.env.NODE_ENV === "development" && img.naturalWidth < 374) {
                          console.warn(`Image width is ${img.naturalWidth}px, minimum required is 374px. URL: ${currentContent.media.url}`);
                        }
                      }}
                      onError={(e) => {
                        if (process.env.NODE_ENV === "development") {
                          console.error("Error loading image:", currentContent.media.url, e);
                        }
                        const img = e.currentTarget;
                        img.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'w-full h-full flex items-center justify-center bg-red-900/20 text-white text-xs p-4';
                        errorDiv.textContent = 'Ошибка загрузки изображения';
                        img.parentElement?.appendChild(errorDiv);
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#643F2E]">
                    <div className="text-center text-white/50 text-sm px-4">
                      <p className="mb-2">Изображение не загружено</p>
                      <p className="text-xs">Добавьте медиа файл в Strapi CMS</p>
                      <p className="text-xs mt-1">Минимальная ширина: 374px</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <div className="text-white text-xl mb-4 font-semibold">
              {error ? "Ошибка загрузки контента" : "Контент не найден"}
            </div>
            {error && (
              <div className="text-brown-light text-sm mb-4 bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                <p className="font-medium mb-2">Ошибка: {error}</p>
                <p className="text-xs opacity-80">
                  Проверьте, что Strapi CMS запущен и доступен по адресу: {API_BASE_URL}
                </p>
              </div>
            )}
            <div className="text-brown-light text-sm space-y-2">
              <p className="font-medium">Для отображения hero секции необходимо:</p>
              <ol className="list-decimal list-inside text-left space-y-1 text-xs opacity-90 max-w-md mx-auto">
                <li>Открыть Strapi Admin панель</li>
                <li>Перейти в коллекцию "Page" (Pages)</li>
                <li>Создать новую запись с полями:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                    <li>Title (обязательно)</li>
                    <li>Subtitle (опционально)</li>
                    <li>Description (опционально)</li>
                    <li>CTA Text (текст кнопки)</li>
                    <li>CTA Link (ссылка для кнопки)</li>
                    <li>Media (изображение или видео)</li>
                    <li>Media Type (image или video)</li>
                  </ul>
                </li>
                <li>Сохранить и опубликовать запись</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
