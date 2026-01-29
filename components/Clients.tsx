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
        setClients(clientsData || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentLanguage, i18n.language]);

  const nextClient = () => {
    setCurrentIndex((prev) => (prev + 1) % clients.length);
  };

  const prevClient = () => {
    setCurrentIndex((prev) => (prev - 1 + clients.length) % clients.length);
  };

  if (loading) {
    return (
      <section id="clients" className="bg-brown-dark py-16">
        <div className="container mx-auto px-6 md:px-24">
          <div className="text-center text-white">Loading...</div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  const currentClient = clients[currentIndex];

  return (
    <section id="clients" className="bg-brown-dark py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-24">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("clients.title")}
          </h2>
          <p className="text-white text-base md:text-lg max-w-2xl">
            {t("clients.subtitle")}
          </p>
        </div>

        <div className="bg-brown-dark rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-64 md:h-80 bg-brown-light rounded-lg overflow-hidden">
              {currentClient.image ? (
                <Image
                  src={currentClient.image.url}
                  alt={currentClient.image.alt || currentClient.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No Image
                </div>
              )}
            </div>

            <div className="text-white">
              {currentClient.testimonial && (
                <blockquote className="text-lg md:text-xl mb-6 leading-relaxed">
                  &ldquo;{currentClient.testimonial}&rdquo;
                </blockquote>
              )}

              <div className="mt-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {currentClient.name}
                </h3>
                {currentClient.position && (
                  <p className="text-gray-300 text-base md:text-lg">
                    {currentClient.position}
                    {currentClient.company && ` / ${currentClient.company}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {clients.length > 1 && (
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={prevClient}
                className="w-12 h-12 rounded-full bg-brown-light text-white hover:bg-brown-dark transition-colors flex items-center justify-center"
                aria-label="Previous client"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
              <button
                onClick={nextClient}
                className="w-12 h-12 rounded-full bg-white text-brown-dark hover:bg-gray-100 transition-colors flex items-center justify-center"
                aria-label="Next client"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
