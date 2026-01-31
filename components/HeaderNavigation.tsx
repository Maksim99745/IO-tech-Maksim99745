"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery, setSearchOpen } from "@/store/slices/searchSlice";
import { useRouter } from "next/navigation";
import { Service } from "@/types";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderNavigation() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { query, isSearchOpen } = useAppSelector((state) => state.search);
  const { currentLanguage } = useAppSelector((state) => state.language);
  const router = useRouter();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { strapiApi } = await import("@/lib/api/strapi");
        const locale = currentLanguage || i18n.language || "en";
        const result = await strapiApi.getServices(locale, 1, 100);
        setServices(result.data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch services:", error);
        }
      }
    };
    fetchServices();
  }, [currentLanguage, i18n.language]);

  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchOpen(false));
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <header className="bg-transparent text-white h-[91px] flex items-center">
      <nav className="container mx-auto px-6 py-4 md:px-24">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 space-x-6 rtl:space-x-reverse">
            <Link
              href="/"
              className="hover:text-brown-light transition-colors"
              suppressHydrationWarning
            >
              {mounted ? t("nav.home") : "Home"}
            </Link>

            <Link
              href="/about"
              className="hover:text-brown-light transition-colors"
            >
              {t("nav.aboutUs")}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimeout) {
                  clearTimeout(closeTimeout);
                  setCloseTimeout(null);
                }
                setIsServicesOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsServicesOpen(false);
                }, 200);
                setCloseTimeout(timeout);
              }}
            >
              <button className="hover:text-brown-light transition-colors flex items-center">
                {t("nav.services")}
                <svg
                  className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isServicesOpen && (
                <div 
                  className="fixed left-[40px] right-[40px] top-[91px] bg-brown-dark rounded-xl shadow-2xl p-8 z-50"
                  onMouseEnter={() => {
                    if (closeTimeout) {
                      clearTimeout(closeTimeout);
                      setCloseTimeout(null);
                    }
                    setIsServicesOpen(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setIsServicesOpen(false);
                    }, 200);
                    setCloseTimeout(timeout);
                  }}
                >
                  {services.length > 0 ? (
                    <div className="grid grid-cols-4 gap-8 mb-6">
                      {Array.from({ length: 4 }).map((_, colIndex) => {
                        const itemsPerColumn = Math.ceil(services.length / 4);
                        const startIndex = colIndex * itemsPerColumn;
                        const endIndex = Math.min(startIndex + itemsPerColumn, services.length);
                        const columnServices = services.slice(startIndex, endIndex);
                        
                        return (
                          <div key={colIndex} className="space-y-2">
                            {columnServices.map((service) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="block text-white hover:text-brown-light transition-colors text-base py-2"
                                onClick={() => setIsServicesOpen(false)}
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-white text-center py-4">
                      {t("common.loading")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="hover:text-brown-light transition-colors"
            >
              {t("nav.blog")}
            </Link>

            <Link
              href="#team"
              className="hover:text-brown-light transition-colors"
            >
              {t("nav.ourTeam")}
            </Link>

            <Link
              href="/contact"
              className="hover:text-brown-light transition-colors"
            >
              {t("nav.contactUs")}
            </Link>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse flex-shrink-0">
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder={t("common.search")}
                    className="bg-brown-light text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-light w-48 text-base"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setSearchOpen(false))}
                    className="ml-2 text-white hover:text-brown-light"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => dispatch(setSearchOpen(true))}
                  className="p-2 hover:text-brown-light transition-colors"
                  aria-label={t("common.search")}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            <LanguageSwitcher />

            <Link
              href="/appointment"
              className="hidden md:block bg-transparent text-white px-6 py-2 rounded-lg border border-white hover:bg-white/10 transition-colors font-medium"
            >
              {t("nav.bookAppointment")}
            </Link>

            <button
              className="md:hidden p-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              href="/"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              suppressHydrationWarning
            >
              {mounted ? t("nav.home") : "Home"}
            </Link>
            <Link
              href="/about"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.aboutUs")}
            </Link>
            <div className="py-2">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center justify-between w-full hover:text-brown-light transition-colors"
              >
                {t("nav.services")}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="block py-2 hover:text-brown-light transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/blog"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.blog")}
            </Link>
            <Link
              href="#team"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.ourTeam")}
            </Link>
            <Link
              href="/contact"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.contactUs")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
