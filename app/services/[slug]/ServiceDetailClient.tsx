"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { Service } from "@/types";
import Image from "next/image";
import Link from "next/link";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";

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
        <div className="relative w-full min-h-[2435px]">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute w-full h-[1056px] top-[850px] bg-black/5" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-24 py-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#4B2615] hover:opacity-70 transition-opacity mb-8 text-base font-bold leading-[26px] opacity-70"
            >
              <span className="text-[#4B2615] text-[30px] font-[FontAwesome] font-normal rotate-180 inline-block">
                &#xf105;
              </span>
              <span>Back</span>
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
                  <div key={index} className="relative pl-8">
                    <div className={`absolute left-0 top-0 w-[3px] bg-[rgba(217,217,217,0.61)] rounded-[9px] ${subsection.items && subsection.items.length > 0 ? 'h-[194px]' : 'h-[93px]'}`} />
                    <div className="absolute left-[39px] top-[3px] w-[10.28px] h-[11px] bg-[#4B2615] rounded-[2px]" />
                    <div className="pl-8">
                      <h2 className="text-[#4B2615] mb-4 text-base font-bold leading-[26px] break-words max-w-[972px]">
                        {subsection.title}
                      </h2>
                      <p 
                        className={`text-[#1E1E1E] mb-4 opacity-70 text-base leading-[26px] break-words max-w-[908.44px] ${subsection.items && subsection.items.length > 0 ? 'font-bold' : 'font-normal'}`}
                        dangerouslySetInnerHTML={{ 
                          __html: subsection.description.replace(/\n/g, '<br/>') 
                        }}
                      />
                      {subsection.items && subsection.items.length > 0 && (
                        <ul className="text-[#1E1E1E] space-y-2 opacity-70 text-base font-normal leading-[26px] break-words max-w-[908.44px]">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\n/g, '<br/>') 
                            }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {service.content && (
              <div className="mt-12 text-[#1E1E1E] opacity-70 text-base font-normal leading-[26px] text-justify max-w-[1142px]" dangerouslySetInnerHTML={{ __html: service.content }} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
