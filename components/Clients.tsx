"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { Client } from "@/types";
import Image from "next/image";

export default function Clients() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const locale = currentLanguage || i18n.language || "en";
        const clientsData = await strapiApi.getClients(locale);
        setClients((clientsData || []).filter((client): client is Client => client !== null));
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch clients:", error);
        }
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentLanguage, i18n.language]);

  if (clients.length === 0 && !loading) {
    return null;
  }

  const currentClient = clients[currentIndex];

  const nextClient = () => {
    setCurrentIndex((prev) => (prev + 1) % clients.length);
  };

  const prevClient = () => {
    setCurrentIndex((prev) => (prev - 1 + clients.length) % clients.length);
  };

  return (
    <section id="clients" className="bg-[#4B2615] w-full relative z-10 flex justify-center items-center h-[853px] min-h-[853px]">
      <div className="w-full max-w-[1401.10px] h-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white">Loading clients...</div>
          </div>
        )}
        
        {!loading && clients.length > 0 && (
          <>
        <div className="absolute text-white left-[122px] top-[100px] font-bold text-[40px] leading-[52px] break-words">
          {t("clients.title")}
        </div>

        <div className="absolute text-white w-[579px] left-[121.55px] top-[178.27px] opacity-70 font-normal text-lg break-words">
          {t("clients.subtitle")}
        </div>

        <div className="absolute bg-[#643F2E] overflow-hidden w-[374px] h-[374px] left-[122px] top-[312px]">
          {(() => {
            const fallbackImages = ['/assets/Image (6).png', '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg'];
            const imageUrl = currentClient.image?.url || fallbackImages[currentIndex % fallbackImages.length];
            
            return (
              <img
                src={imageUrl}
                alt={currentClient.image?.alt || currentClient.name || "Client"}
                className="w-full h-full object-cover"
              />
            );
          })()}
        </div>

        {currentClient.testimonial && (
          <div className="absolute text-white w-[728px] left-[545px] top-[312px] opacity-60 font-normal text-2xl leading-10 break-words">
            &quot;{currentClient.testimonial}&quot;
          </div>
        )}

        <div className="absolute text-white left-[545px] top-[613px] font-semibold text-2xl leading-[45px] break-words">
          {currentClient.name}
        </div>

        <div className="absolute text-white left-[545px] top-[664px] font-normal text-base break-words">
          {currentClient.position && currentClient.company 
            ? `${currentClient.position} / ${currentClient.company}`
            : currentClient.position || currentClient.company || ""
          }
        </div>

        {clients.length > 1 && (
          <>
            <button
              onClick={prevClient}
              className="absolute w-[67px] h-[67px] left-[1149px] top-[686px] bg-white/10 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Previous client"
            >
              <svg width="7" height="14" viewBox="0 0 7 14" fill="none">
                <path d="M6 1L1 7L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={nextClient}
              className="absolute w-[67px] h-[67px] left-[1251px] top-[686px] bg-white rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Next client"
            >
              <div className="w-6 h-6 overflow-hidden">
                <svg width="7" height="14" viewBox="0 0 7 14" fill="none" className="ml-3 mt-[5px]">
                  <path d="M1 1L6 7L1 13" stroke="#4B2615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            <div className="absolute text-[#4B2615] left-[1176px] top-[639px] font-medium text-base break-words">
              {currentIndex + 1}/{clients.length} {t("clients.reviews")}
            </div>
          </>
        )}
        </>
        )}
      </div>
    </section>
  );
}
