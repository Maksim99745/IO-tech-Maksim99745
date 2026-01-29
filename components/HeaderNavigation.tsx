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
    <header className="bg-brown-dark text-white sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 md:px-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-xl md:text-2xl font-bold font-sans">
              IO Tech
            </Link>

            <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <Link
                href="/"
                className="hover:text-brown-light transition-colors"
              >
                {t("nav.home")}
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
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
                  <div className="absolute top-full left-0 mt-2 bg-brown-dark border border-brown-light rounded-lg shadow-lg w-[800px] p-6">
                    {services.length > 0 ? (
                      <div className="grid grid-cols-3 gap-6">
                        {services.map((service, index) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="block px-4 py-2 hover:bg-brown-light transition-colors text-base"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-400">
                        {t("common.loading")}
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-brown-light">
                      <Link
                        href="/services"
                        className="inline-block bg-white text-brown-dark px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        {t("common.readMore")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="#team"
                className="hover:text-brown-light transition-colors"
              >
                {t("nav.team")}
              </Link>
              <Link
                href="#clients"
                className="hover:text-brown-light transition-colors"
              >
                {t("nav.clients")}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
              className="hidden md:block bg-white text-brown-dark px-6 py-2 rounded-lg border border-white hover:bg-gray-100 transition-colors font-medium"
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
              href="#team"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.team")}
            </Link>
            <Link
              href="#clients"
              className="block py-2 hover:text-brown-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.clients")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
