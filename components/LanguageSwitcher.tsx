"use client";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "@/store/slices/languageSlice";
import { Language } from "@/types";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const toggleLanguage = () => {
    const newLang: Language = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
    
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-brown-dark hover:bg-brown-light text-white rounded transition-colors"
      aria-label="Toggle language"
    >
      {i18n.language === "ar" ? "EN" : "AR"}
    </button>
  );
}
