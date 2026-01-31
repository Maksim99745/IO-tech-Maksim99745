"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { Service } from "@/types";
import Image from "next/image";
import Link from "next/link";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";
import { strapiApi } from "@/lib/api/strapi";

interface ServiceDetailClientProps {
  service: Service;
  locale?: string;
}

export default function ServiceDetailClient({ service: initialService, locale: initialLocale }: ServiceDetailClientProps) {
  const { i18n, t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [service, setService] = useState<Service>(initialService);
  const [loading, setLoading] = useState(false);

  // Get current locale
  const currentLocale = currentLanguage || i18n.language || "en";

  // Reload service data when language changes
  useEffect(() => {
    const loadService = async () => {
      // Always reload when locale changes to ensure correct language
      if (currentLocale && initialService.slug) {
        try {
          setLoading(true);
          // Try to get service with current locale
          // For Arabic, slug might have -ar suffix, but filterByLocale will handle it
          const newService = await strapiApi.getServiceBySlug(initialService.slug, currentLocale);
          if (newService) {
            setService(newService);
          } else if (process.env.NODE_ENV === "development") {
            console.warn(`Service not found for slug: ${initialService.slug}, locale: ${currentLocale}`);
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error reloading service:", error);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    // Only reload if locale actually changed
    if (currentLocale !== initialLocale) {
      loadService();
    }
  }, [currentLocale, initialService.slug, initialLocale]);

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  return (
    <>
      <div className="relative h-[850px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image?.url || "/assets/Home  bg image.png"}
            alt={service.image?.alt || service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(75,38,21,0.28)] to-[rgba(75,38,21,0.68)]" />
        </div>
        <div className="relative z-10 h-full flex flex-col">
          <HeaderNavigation />
        </div>
      </div>

      <main className="min-h-screen bg-[#FBFBFB] relative">
        <div className="relative w-full">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.030,
              background: 'url(/assets/Services%20bg.png) lightgray 0px 0px / 100% 100% no-repeat',
            }}
          />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-24 py-16">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity mb-8"
            >
              <svg 
                width="10" 
                height="17" 
                viewBox="0 0 10 17" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="h-[35px]"
              >
                <path 
                  d="M9.57589 1.00446C9.6875 1.11606 9.7433 1.24441 9.7433 1.3895C9.7433 1.53459 9.6875 1.66294 9.57589 1.77454L2.99665 8.35379L9.57589 14.933C9.6875 15.0446 9.7433 15.173 9.7433 15.3181C9.7433 15.4632 9.6875 15.5915 9.57589 15.7031L8.73884 16.5402C8.62723 16.6518 8.49888 16.7076 8.3538 16.7076C8.20871 16.7076 8.08036 16.6518 7.96875 16.5402L0.167411 8.73883C0.055804 8.62722 3.72529e-07 8.49887 3.72529e-07 8.35379C3.72529e-07 8.2087 0.055804 8.08035 0.167411 7.96874L7.96875 0.167401C8.08036 0.0557934 8.20871 -1.0252e-05 8.3538 -1.0252e-05C8.49888 -1.0252e-05 8.62723 0.0557934 8.73884 0.167401L9.57589 1.00446Z" 
                  fill="#4B2615"
                />
              </svg>
              <span className="opacity-70 text-[#4B2615] text-base font-bold leading-[26px]">
                Back
              </span>
            </Link>

            <h1 className="text-[#4B2615] mb-6 text-[42px] font-medium leading-8 break-words">
              {service.title}
            </h1>

            <p className="text-[#1E1E1E] mb-12 opacity-70 text-base font-normal leading-[26px] text-justify max-w-[1142px]">
              {service.description}
            </p>

            {service.subsections && service.subsections.length > 0 && (
              <div className="space-y-8">
                {service.subsections.map((subsection, index) => (
                  <div key={index} className="space-y-4">
                    <h2 className="text-[#4B2615] text-base font-bold leading-[26px] break-words max-w-[972px]">
                      {subsection.title}
                    </h2>
                    <div className="flex pb-4">
                      <div className="flex flex-col items-center flex-shrink-0 relative">
                        <div className="w-[3px] flex-1 bg-[rgba(217,217,217,0.61)] rounded-[9px]" />
                      </div>
                      <div className="flex-shrink-0 pt-[3px] ml-[26px] relative z-10">
                        <div className="w-[10.28px] h-[11px] min-w-[10.28px] min-h-[11px] bg-[#4B2615] rounded-[2px]" />
                      </div>
                      <div className="flex-1 ml-[10px]">
                        <p 
                          className={`text-[#1E1E1E] opacity-70 text-base leading-[26px] break-words max-w-[908.44px] ${subsection.items && subsection.items.length > 0 ? 'font-bold' : 'font-normal'}`}
                          dangerouslySetInnerHTML={{ 
                            __html: subsection.description.replace(/\n/g, '<br/>') 
                          }}
                        />
                        {subsection.items && subsection.items.length > 0 && (
                          <ul className="text-[#1E1E1E] space-y-2 opacity-70 text-base font-normal leading-[26px] break-words max-w-[908.44px] mt-4">
                            {subsection.items.map((item, itemIndex) => (
                              <li key={itemIndex} dangerouslySetInnerHTML={{ 
                                __html: item.replace(/\n/g, '<br/>') 
                              }} />
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {service.content && (
              <div className="mt-12 text-[#1E1E1E] opacity-70 text-base font-normal leading-[26px] text-justify max-w-[1142px]" dangerouslySetInnerHTML={{ __html: service.content }} />
            )}

            <div className="mt-12 space-y-8 max-w-[1142px]">
              <div className="space-y-4">
                <h2 className="text-[#4B2615] text-base font-bold leading-[26px] break-words max-w-[972px]">
                  {t("service.generalConsultations.title")}
                </h2>
                <div className="flex pb-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-[3px] flex-1 bg-[rgba(217,217,217,0.61)] rounded-[9px]" />
                  </div>
                  <div className="flex-shrink-0 pt-[3px] ml-[26px]">
                    <div className="w-[10.28px] h-[11px] bg-[#4B2615] rounded-[2px]" />
                  </div>
                  <div className="flex-1 ml-[10px]">
                    <p className="text-[#1E1E1E] opacity-70 text-base font-normal leading-[26px] break-words max-w-[908.44px]">
                      {t("service.generalConsultations.description")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-[#4B2615] text-base font-bold leading-[26px] break-words max-w-[972px]">
                  {t("service.corporateConsultations.title")}
                </h2>
                <div className="flex pb-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-[3px] flex-1 bg-[rgba(217,217,217,0.61)] rounded-[9px]" />
                  </div>
                  <div className="flex-shrink-0 pt-[3px] ml-[26px]">
                    <div className="w-[10.28px] h-[11px] bg-[#4B2615] rounded-[2px]" />
                  </div>
                  <div className="flex-1 ml-[10px]">
                    <p className="text-[#1E1E1E] opacity-70 text-base font-bold leading-[26px] break-words max-w-[908.44px] mb-4">
                      {t("service.corporateConsultations.intro")}
                    </p>
                    <ul className="text-[#1E1E1E] space-y-2 opacity-70 text-base font-normal leading-[26px] break-words max-w-[908.44px]">
                      <li>- {t("service.corporateConsultations.items.establishing")}</li>
                      <li>- {t("service.corporateConsultations.items.contracts")}</li>
                      <li>- {t("service.corporateConsultations.items.disputes")}</li>
                      <li>- {t("service.corporateConsultations.items.compliance")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-[#4B2615] text-base font-bold leading-[26px] break-words max-w-[972px]">
                  {t("service.individualConsultations.title")}
                </h2>
                <div className="flex pb-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-[3px] flex-1 bg-[rgba(217,217,217,0.61)] rounded-[9px]" />
                  </div>
                  <div className="flex-shrink-0 pt-[3px] ml-[26px]">
                    <div className="w-[10.28px] h-[11px] bg-[#4B2615] rounded-[2px]" />
                  </div>
                  <div className="flex-1 ml-[10px]">
                    <p className="text-[#1E1E1E] opacity-70 text-base font-bold leading-[26px] break-words max-w-[908.44px] mb-4">
                      {t("service.individualConsultations.intro")}
                    </p>
                    <ul className="text-[#1E1E1E] space-y-2 opacity-70 text-base font-normal leading-[26px] break-words max-w-[908.44px]">
                      <li>- {t("service.individualConsultations.items.family")}</li>
                      <li>- {t("service.individualConsultations.items.realEstate")}</li>
                      <li>- {t("service.individualConsultations.items.employment")}</li>
                      <li>- {t("service.individualConsultations.items.criminal")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-[#1E1E1E] opacity-70 text-base font-normal leading-[26px] text-justify max-w-[1142px]">
              {t("service.footer")}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
