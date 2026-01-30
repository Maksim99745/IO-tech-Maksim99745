"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { Service, TeamMember } from "@/types";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [activeTab, setActiveTab] = useState<"services" | "team">("services");
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setServices([]);
      setTeamMembers([]);
      setError(null);
      return;
    }

    const performSearch = async () => {
      const locale = currentLanguage || i18n.language || "en";
      setError(null);
      
      if (activeTab === "services") {
        setServicesLoading(true);
        try {
          const result = await strapiApi.searchServices(query, locale, 1, 20);
          setServices(result.data);
        } catch (err: any) {
          console.error("Error searching services:", err);
          setError(err.message || t("common.error"));
          setServices([]);
        } finally {
          setServicesLoading(false);
        }
      } else {
        setTeamLoading(true);
        try {
          const result = await strapiApi.searchTeamMembers(query, locale, 1, 20);
          setTeamMembers(result.data);
        } catch (err: any) {
          console.error("Error searching team members:", err);
          setError(err.message || t("common.error"));
          setTeamMembers([]);
        } finally {
          setTeamLoading(false);
        }
      }
    };

    performSearch();
  }, [query, activeTab, currentLanguage, i18n.language, t]);

  const isLoading = servicesLoading || teamLoading;

  return (
    <>
      <HeaderNavigation />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-6 md:px-24 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t("search.title")}
          </h1>

          {query && (
            <p className="text-gray-300 mb-8">
              {t("common.search")}: &ldquo;{query}&rdquo;
            </p>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "services"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("search.services")}
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "team"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("search.team")}
            </button>
          </div>

          {!query.trim() ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {t("search.noResults")}
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">{t("common.loading")}</p>
            </div>
          ) : activeTab === "services" ? (
            <div className="space-y-6">
              {services.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">{t("search.noResults")}</p>
                </div>
              ) : (
                services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="block bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {service.image && (
                        <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          <Image
                            src={service.image.url}
                            alt={service.image.alt || service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {service.title}
                        </h2>
                        {service.description && (
                          <p className="text-gray-300 line-clamp-3">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-400 text-lg">{t("search.noResults")}</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
                  >
                    {member.image && (
                      <div className="relative w-full h-48 bg-gray-800">
                        <Image
                          src={member.image.url}
                          alt={member.image.alt || member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-gray-300">{member.role}</p>
                      <div className="flex gap-4 mt-4">
                        {member.whatsapp && (
                          <a
                            href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brown-light hover:text-white transition-colors"
                            aria-label="WhatsApp"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="text-brown-light hover:text-white transition-colors"
                            aria-label="Phone"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-brown-light hover:text-white transition-colors"
                            aria-label="Email"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <>
        <HeaderNavigation />
        <main className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-gray-400">{typeof window !== "undefined" ? "Loading..." : ""}</p>
        </main>
        <Footer />
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
