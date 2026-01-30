"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { TeamMember } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const locale = currentLanguage || i18n.language || "en";
        console.log("Fetching team members for locale:", locale);
        const members = await strapiApi.getTeamMembers(locale);
        console.log("Team members received:", members);
        setTeamMembers(members || []);
        if (!members || members.length === 0) {
          console.warn("No team members found in Strapi for locale:", locale);
        }
      } catch (error: any) {
        console.error("Failed to fetch team members:", error);
        console.error("Error details:", error.response?.data || error.message);
        setError(error.message || "Failed to load team members");
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [currentLanguage, i18n.language]);

  useEffect(() => {
    if (teamMembers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  if (loading) {
    return (
      <section className="relative flex-1 bg-transparent flex items-center justify-center w-full">
        <div className="relative z-20 text-white text-xl">Loading...</div>
      </section>
    );
  }

  const currentMember = teamMembers.length > 0 ? teamMembers[currentIndex] : null;

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  return (
    <section className="relative flex-1 bg-transparent overflow-hidden w-full">
      {currentMember ? (
        <div className="relative z-20 h-full flex items-start">
          <div className="container mx-auto px-6 md:px-24 w-full">
            <div className="flex items-start gap-8">
              <div className="flex items-start gap-[109px]">
                <div className="flex flex-col items-center pt-[294px]">
                  <button
                    onClick={nextMember}
                    className="w-[12px] h-[35px] flex items-center justify-center text-white text-[30px] leading-[100%] text-center mb-[88px] font-[FontAwesome] font-normal tracking-normal"
                    aria-label="Next team member"
                  >
                    <Image
                      src="/assets/fa-angle-left.svg"
                      alt="Next"
                      width={10}
                      height={17}
                      className="w-full h-full"
                    />
                  </button>

                  {teamMembers.length > 1 && (
                    <div className="flex flex-col items-center gap-2">
                      {teamMembers.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? "bg-white"
                              : "bg-transparent border border-white hover:bg-white/20"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col pt-[298px]">
                  <h1 
                    className="text-[40px] leading-[28px] text-white mb-[35px]"
                  >
                    {currentMember.name}
                  </h1>
                  
                  <p 
                    className="text-[18px] leading-[28px] font-medium text-white mb-[76px] max-w-[700px]"
                  >
                    {t("hero.description")}
                  </p>

                  <Link
                    href="/#team"
                    className="relative w-[161px] h-[60px] bg-white rounded-[12px] flex items-center justify-center hover:opacity-90 transition-opacity font-medium text-lg leading-[26px] text-[#4B2615] text-center"
                  >
                    {t("common.readMore")}
                  </Link>
                </div>
              </div>

              <div className="relative w-[374px] h-[374px] bg-[#643F2E] rounded-lg overflow-hidden ml-auto mt-[235px]">
                {currentMember.image ? (
                  <Image
                    src={currentMember.image.url}
                    alt={currentMember.image.alt || currentMember.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src="/assets/Worker picture.png"
                    alt="Team members"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-2">No team members available</div>
            {error && (
              <div className="text-brown-light text-sm">Error: {error}</div>
            )}
            <div className="text-brown-light text-sm mt-2">
              Please add team members in Strapi CMS
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
