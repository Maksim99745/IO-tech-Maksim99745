"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery, setSearchOpen } from "@/store/slices/searchSlice";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderNavigation() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { query, isSearchOpen } = useAppSelector((state) => state.search);
  const router = useRouter();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { strapiApi } = await import("@/lib/api/strapi");
        const result = await strapiApi.getServices("en", 1, 10);
        setServices(result.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

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
            >
              {t("nav.home")}
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
                  <div className="grid grid-cols-4 gap-8 mb-6">
                    <div className="space-y-2">
                      <Link href="/services/legal-consultation" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Legal Consultation Services
                      </Link>
                      <Link href="/services/foreign-investment" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Foreign Investment Services
                      </Link>
                      <Link href="/services/contracts" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Contracts
                      </Link>
                      <Link href="/services/notarization" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Notarization
                      </Link>
                      <Link href="/services/insurance" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Insurance
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/services/defense" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        ...and Defense in All Cases
                      </Link>
                      <Link href="/services/banks-financial" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Banks and Financial Institutions
                      </Link>
                      <Link href="/services/corporate-governance" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Corporate Governance Services
                      </Link>
                      <Link href="/services/companies-liquidation" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Companies Liquidation
                      </Link>
                      <Link href="/services/internal-regulations" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Internal Regulations for Companies
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/services/companies-institutions" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Services for Companies and Institutions
                      </Link>
                      <Link href="/services/arbitration" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Arbitration
                      </Link>
                      <Link href="/services/intellectual-property" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Intellectual Property
                      </Link>
                      <Link href="/services/corporate-restructuring" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Corporate Restructuring and Reorganization
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/services/establishing-companies" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Establishing National and Foreign Companies
                      </Link>
                      <Link href="/services/commercial-agencies" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Commercial Agencies
                      </Link>
                      <Link href="/services/vision-2030" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Supporting Vision 2030
                      </Link>
                      <Link href="/services/estates" className="block text-white hover:text-brown-light transition-colors text-base py-2">
                        Estates
                      </Link>
                    </div>
                  </div>
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

          {/* Элементы справа: поиск, язык, кнопка */}
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
              Book Appointment
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
            >
              {t("nav.home")}
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
