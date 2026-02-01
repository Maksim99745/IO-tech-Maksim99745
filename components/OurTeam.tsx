"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { strapiApi } from "@/lib/api/strapi";
import { TeamMember } from "@/types";
import Image from "next/image";

export default function OurTeam() {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const locale = currentLanguage || i18n.language || "en";
        const members = await strapiApi.getTeamMembers(locale);
        setTeamMembers(members || []);
        setCurrentIndex(0);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch team members:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [currentLanguage, i18n.language]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);
  const currentMembers = teamMembers.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (teamMembers.length === 0 && !loading) {
    return (
      <section id="team" className="bg-[#F3F3F3] w-full relative z-10 flex justify-center items-center h-[746px] min-h-[746px]">
        <div className="w-full max-w-[1400px] h-full flex flex-col justify-center items-center md:px-24 relative">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-bold text-[#4B2615] mb-4 leading-[52px] text-center">
              {t("team.title")}
            </h2>
            <p className="text-[18px] text-[#1E1E1E] max-w-2xl mx-auto opacity-70 leading-[28px] text-center font-medium">
              {t("team.subtitle")}
            </p>
          </div>
          <div className="text-center text-gray-500">
            {t("team.noMembers")}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="bg-[#F3F3F3] w-full relative z-10 flex justify-center items-center h-[746px] min-h-[746px]">
      <div className="w-full max-w-[1400px] h-full flex flex-col justify-center items-center md:px-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-[42px] font-bold text-[#4B2615] mb-4 leading-[52px] text-center">
            {t("team.title")}
          </h2>
          <p className="text-[18px] text-[#1E1E1E] max-w-2xl mx-auto opacity-70 leading-[28px] text-center font-medium">
            {t("team.subtitle")}
          </p>
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto flex items-center">
          {teamMembers.length > itemsPerPage && (
            <button
              onClick={prevPage}
              className="hidden md:block z-30 cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 w-[13px] h-[22px] mr-[115px] rtl:mr-0 rtl:ml-[115px]"
              aria-label="Previous team members"
            >
              <Image
                src="/assets/left-arrow.svg"
                alt="Previous"
                width={13}
                height={22}
                className="w-full h-full rtl:rotate-180"
              />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 w-full flex-1 gap-7">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-6">
                    <div className="relative w-[270px] h-[174px] bg-[#643F2E] overflow-hidden animate-pulse" />
                    <div className="text-center">
                      <div className="h-7 w-32 bg-gray-300 rounded mb-2 mx-auto animate-pulse" />
                      <div className="h-5 w-24 bg-gray-300 rounded mx-auto animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              currentMembers.map((member, index) => {
                const fallbackImages = ['/assets/Image (6).png', '/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg'];
                const imageUrl = member.image?.url || fallbackImages[index % fallbackImages.length];
                
                return (
                  <div key={member.id} className="flex flex-col items-center gap-6">
                    <div className="relative w-[270px] h-[174px] bg-[#643F2E] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={member.image?.alt || member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center w-full">
                      <h3 className="text-[22px] font-medium text-[#4B2615] mb-2 leading-[32px] text-center">
                        {member.name}
                      </h3>
                      <p className="text-[14px] font-bold uppercase leading-[26px] text-center mb-5 tracking-[2px] text-[rgba(21.06,20.34,56.79,0.40)]">
                        {(() => {
                          const roleKey = `team.roles.${member.role}`;
                          const translated = t(roleKey);
                          return translated !== roleKey ? translated : member.role;
                        })()}
                      </p>

                      <div className="flex items-center justify-center mx-auto h-6 gap-3">
                        {member.whatsapp ? (
                          <a
                            href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-[22px] h-[22px]"
                            aria-label="WhatsApp"
                          >
                            <Image
                              src="/assets/whatsapp-icon.png"
                              alt="WhatsApp"
                              width={22}
                              height={22}
                              className="w-full h-full object-contain"
                            />
                          </a>
                        ) : (
                          <div className="w-[22px] h-[22px]" />
                        )}
                        {member.phone ? (
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center justify-center w-[27px] h-[27px]"
                            aria-label="Phone"
                          >
                            <Image
                              src="/assets/phone-icon.png"
                              alt="Phone"
                              width={27}
                              height={27}
                              className="w-full h-full object-contain"
                            />
                          </a>
                        ) : (
                          <div className="w-[27px] h-[27px]" />
                        )}
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center w-[22.5px] h-4"
                            aria-label="Email"
                          >
                            <Image
                              src="/assets/email-icon.png"
                              alt="Email"
                              width={25}
                              height={18}
                              className="w-full h-full object-contain"
                            />
                          </a>
                        ) : (
                          <div className="w-[22.5px] h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {teamMembers.length > itemsPerPage && (
            <button
              onClick={nextPage}
              className="hidden md:block z-30 cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 w-[13px] h-[22px] ml-[115px] rtl:ml-0 rtl:mr-[115px]"
              aria-label="Next team members"
            >
              <Image
                src="/assets/right-arrow.svg"
                alt="Next"
                width={13}
                height={22}
                className="w-full h-full rtl:rotate-180"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
