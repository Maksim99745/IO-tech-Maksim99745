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
  const [servicesPage, setServicesPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const [servicesPagination, setServicesPagination] = useState<{ page: number; pageSize: number; pageCount: number; total: number } | null>(null);
  const [teamPagination, setTeamPagination] = useState<{ page: number; pageSize: number; pageCount: number; total: number } | null>(null);
  const pageSize = 9;

  useEffect(() => {
    if (!query.trim()) {
      setServices([]);
      setTeamMembers([]);
      setError(null);
      setServicesPage(1);
      setTeamPage(1);
      setServicesPagination(null);
      setTeamPagination(null);
      return;
    }

    const performSearch = async () => {
      const locale = currentLanguage || i18n.language || "en";
      setError(null);
      
      if (activeTab === "services") {
        setServicesLoading(true);
        try {
          const result = await strapiApi.searchServices(query, locale, servicesPage, pageSize);
          setServices(result.data);
          setServicesPagination(result.pagination);
        } catch (err: unknown) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error searching services:", err);
          }
          const error = err as { message?: string };
          setError(error.message || t("common.error"));
          setServices([]);
          setServicesPagination(null);
        } finally {
          setServicesLoading(false);
        }
      } else {
        setTeamLoading(true);
        try {
          const result = await strapiApi.searchTeamMembers(query, locale, teamPage, pageSize);
          setTeamMembers(result.data);
          setTeamPagination(result.pagination);
        } catch (err: unknown) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error searching team members:", err);
          }
          const error = err as { message?: string };
          setError(error.message || t("common.error"));
          setTeamMembers([]);
          setTeamPagination(null);
        } finally {
          setTeamLoading(false);
        }
      }
    };

    performSearch();
  }, [query, activeTab, currentLanguage, i18n.language, t, servicesPage, teamPage]);

  useEffect(() => {
    setServicesPage(1);
    setTeamPage(1);
  }, [query, activeTab]);

  const isLoading = servicesLoading || teamLoading;

  const renderPagination = (
    currentPage: number,
    totalPages: number | undefined,
    onPageChange: (page: number) => void,
    isLoading: boolean
  ) => {
    if (!totalPages || totalPages <= 1 || isLoading) return null;

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 3; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 2; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="flex items-center justify-start gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="w-6 h-6 flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#161616" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="h-6 min-w-6 px-1 rounded border border-[#161616] flex items-center justify-center"
              >
                <span className="text-[#161616] text-sm leading-5">...</span>
              </div>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className={`h-6 min-w-6 px-1 rounded flex items-center justify-center relative ${
                isActive ? "" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
            >
              <span className={`text-[#161616] text-sm leading-5 ${isActive ? "font-normal" : ""}`}>
                {pageNum}
              </span>
              {isActive && (
                <div className="absolute left-1 bottom-0 w-4 h-[3px] bg-[#4B2615] rounded-full" />
              )}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="w-6 h-6 flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#161616" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <>
      <HeaderNavigation />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-24 py-12">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {!query.trim() ? (
            <div className="text-center py-16">
              <p className="text-[#1E1E1E] text-lg">
                {t("search.noResults")}
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <p className="text-[#1E1E1E] text-lg">{t("common.loading")}</p>
            </div>
          ) : (
            <div className="flex gap-8">
              <div className="w-[167px] h-[191px] bg-[#FAFAFA] relative flex-shrink-0">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`absolute left-[50px] top-[47px] text-[#4B2615] text-xl font-semibold leading-5 transition-opacity ${
                    activeTab === "team" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  Team
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`absolute left-[35px] top-[106px] text-[#4B2615] text-xl font-semibold leading-5 transition-opacity ${
                    activeTab === "services" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  Services
                </button>
              </div>

              <div className="flex-1">
          {activeTab === "services" ? (
            <>
              <div className="space-y-0 flex-1">
                {services.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-[#1E1E1E] text-lg">{t("search.noResults")}</p>
                  </div>
                ) : (
                  services.map((service, index) => (
                    <div key={service.id}>
                      <div className="pt-[26px] pb-[33.4px]">
                        <h2 className="text-[#4B2615] text-base font-medium leading-[26px] mb-[33.4px] max-w-[439.70px]">
                          {service.title}
                        </h2>
                        {service.description && (
                          <p className="text-[#1E1E1E] text-base leading-[26px] mb-[33.4px]">
                            {service.description}
                          </p>
                        )}
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-[#4B2615] text-base font-medium underline leading-6"
                        >
                          Read more
                        </Link>
                      </div>
                      {index < services.length - 1 && (
                        <div className="w-full h-px bg-[rgba(151,151,151,0.50)]" />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-8">
                {renderPagination(
                  servicesPage,
                  servicesPagination?.pageCount,
                  setServicesPage,
                  servicesLoading
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {teamMembers.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-[#1E1E1E] text-lg">{t("search.noResults")}</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {member.image && (
                        <div className="relative w-full h-48 bg-gray-100">
                          <img
                            src={member.image.url}
                            alt={member.image.alt || member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#4B2615] mb-2">
                          {member.name}
                        </h3>
                        <p className="text-[#1E1E1E] mb-4">{member.role}</p>
                        <div className="flex gap-4">
                          {member.whatsapp && (
                            <a
                              href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4B2615] hover:opacity-70 transition-opacity"
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
                              className="text-[#4B2615] hover:opacity-70 transition-opacity"
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
                              className="text-[#4B2615] hover:opacity-70 transition-opacity"
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
              <div className="mt-8">
                {renderPagination(
                  teamPage,
                  teamPagination?.pageCount,
                  setTeamPage,
                  teamLoading
                )}
              </div>
            </>
          )}
              </div>
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
