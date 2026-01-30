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
        console.error("Failed to fetch clients:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentLanguage, i18n.language]);

  if (loading) {
    return (
      <section id="clients" className="bg-[#4B2615] w-full relative z-10 flex justify-center items-center" style={{ height: '853px' }}>
        <div className="text-center text-white">Loading clients...</div>
      </section>
    );
  }

  if (clients.length === 0) {
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
    <section id="clients" className="bg-[#4B2615] w-full relative z-10 flex justify-center items-center" style={{ height: '853px' }}>
      <div className="w-full max-w-[1401.10px] h-full relative" style={{ position: 'relative' }}>
        {/* Заголовок */}
        <div 
          className="absolute text-white"
          style={{
            left: '122px',
            top: '100px',
            fontWeight: '700',
            fontSize: '40px',
            lineHeight: '52px',
            wordWrap: 'break-word'
          }}
        >
          {t("clients.title")}
        </div>

        {/* Описание */}
        <div 
          className="absolute text-white"
          style={{
            width: '579px',
            left: '121.55px',
            top: '178.27px',
            opacity: 0.70,
            fontWeight: '400',
            fontSize: '18px',
            wordWrap: 'break-word'
          }}
        >
          {t("clients.subtitle")}
        </div>

        {/* Фото клиента */}
        <div 
          className="absolute bg-[#643F2E] overflow-hidden"
          style={{
            width: '374px',
            height: '374px',
            left: '122px',
            top: '312px'
          }}
        >
          <Image
            src={currentClient.image?.url || "/assets/Worker picture.png"}
            alt={currentClient.image?.alt || currentClient.name || "Client"}
            fill
            className="object-cover"
          />
        </div>

        {/* Отзыв */}
        {currentClient.testimonial && (
          <div 
            className="absolute text-white"
            style={{
              width: '728px',
              left: '545px',
              top: '312px',
              opacity: 0.60,
              fontWeight: '400',
              fontSize: '24px',
              lineHeight: '40px',
              wordWrap: 'break-word'
            }}
          >
            &quot;{currentClient.testimonial}&quot;
          </div>
        )}

        {/* Имя клиента */}
        <div 
          className="absolute text-white"
          style={{
            width: '202px',
            height: '31px',
            left: '545px',
            top: '613px',
            fontWeight: '600',
            fontSize: '24px',
            lineHeight: '45px',
            wordWrap: 'break-word'
          }}
        >
          {currentClient.name}
        </div>

        {/* Должность/Компания */}
        <div 
          className="absolute text-white"
          style={{
            left: '545px',
            top: '664px',
            fontWeight: '400',
            fontSize: '16px',
            wordWrap: 'break-word'
          }}
        >
          {currentClient.position && currentClient.company 
            ? `${currentClient.position} / ${currentClient.company}`
            : currentClient.position || currentClient.company || ""
          }
        </div>

        {/* Навигационные кнопки и счетчик */}
        {clients.length > 1 && (
          <>
            {/* Кнопка назад (прозрачная) */}
            <button
              onClick={prevClient}
              className="absolute"
              style={{
                width: '67px',
                height: '67px',
                left: '1149px',
                top: '686px',
                background: 'rgba(255, 255, 255, 0.10)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Previous client"
            >
              <svg width="7" height="14" viewBox="0 0 7 14" fill="none">
                <path d="M6 1L1 7L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Кнопка вперед (белая) */}
            <button
              onClick={nextClient}
              className="absolute"
              style={{
                width: '67px',
                height: '67px',
                left: '1251px',
                top: '686px',
                background: 'white',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Next client"
            >
              <div style={{ width: '24px', height: '24px', overflow: 'hidden' }}>
                <svg width="7" height="14" viewBox="0 0 7 14" fill="none" style={{ marginLeft: '12px', marginTop: '5px' }}>
                  <path d="M1 1L6 7L1 13" stroke="#4B2615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Счетчик */}
            <div 
              className="absolute text-[#4B2615]"
              style={{
                left: '1176px',
                top: '639px',
                fontWeight: '500',
                fontSize: '16px',
                wordWrap: 'break-word'
              }}
            >
              {currentIndex + 1}/{clients.length} {t("clients.reviews")}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
