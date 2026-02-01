"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSubscriptionLoading,
  setSubscriptionError,
  setSubscriptionSuccess,
  resetSubscription,
} from "@/store/slices/formsSlice";
import { strapiApi } from "@/lib/api/strapi";
import Link from "next/link";

export default function Footer() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { subscription } = useAppSelector((state) => state.forms);

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("footer.invalidEmail"))
      .required(t("footer.invalidEmail")),
  });

  const handleSubmit = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      dispatch(setSubscriptionLoading(true));
      dispatch(resetSubscription());

      await strapiApi.subscribeEmail(values.email);
      
      dispatch(setSubscriptionSuccess(true));
      resetForm();
      
      setTimeout(() => {
        dispatch(resetSubscription());
      }, 3000);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      const errorMessage = axiosError.response?.data?.error?.message || axiosError.message;
      
      if (errorMessage?.includes("duplicate") || errorMessage?.includes("unique")) {
        dispatch(setSubscriptionError("duplicate"));
      } else {
        dispatch(setSubscriptionError("error"));
      }
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };

  return (
    <footer className="bg-[#4B2615] text-white mt-auto w-full relative z-10" style={{ minHeight: '256px' }}>
      <div className="max-w-[1400px] mx-auto flex flex-col h-full pl-[115px] pr-[115px]">
        <div className="pt-[26px] pb-4 flex flex-col md:flex-row justify-end items-start md:items-center gap-6">
              <Formik
                initialValues={{ email: "" }}
                validationSchema={emailSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <div className="relative" style={{ width: '223px', height: '41px' }}>
                    <div className="absolute inset-0 bg-white rounded-[6px] overflow-hidden">
                      <Field
                        type="email"
                        name="email"
                        placeholder={t("footer.subscribePlaceholder")}
                        className={`w-full h-full bg-transparent py-2 rounded-[6px] focus:outline-none pl-[14px] pr-[111px] font-normal text-base leading-5 tracking-normal text-black ${
                          errors.email && touched.email
                            ? "border border-red-500"
                            : "border-0"
                        }`}
                        disabled={subscription.isLoading}
                      />
                      <button
                        type="submit"
                        disabled={subscription.isLoading || isSubmitting}
                        className="absolute bg-brown-dark text-white rounded-[8px] hover:bg-brown-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        style={{
                          width: '101px',
                          height: '30px',
                          top: '5px',
                          right: '5px',
                          fontWeight: '500',
                          fontSize: '12px',
                          lineHeight: '17.33px',
                        }}
                      >
                        {subscription.isLoading ? t("common.loading") : t("footer.subscribe")}
                      </button>
                    </div>
                    {errors.email && touched.email && (
                      <div className="text-red-400 text-xs mt-1 absolute top-full">
                        {errors.email}
                      </div>
                    )}
                  </div>
                )}
              </Formik>

              <div className="flex items-center gap-6">
                <span 
                  className="text-white"
                  style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '26px',
                  }}
                >
                  {t("nav.contactUs")}
                </span>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-brown-light transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-brown-light transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-brown-light transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
        </div>

        <div 
          className="border-t border-white my-4"
          style={{
            opacity: 0.30,
          }}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-wrap gap-6">
              <Link 
                href="/about" 
                className="hover:text-brown-light transition-colors"
                prefetch={false}
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '26px',
                }}
              >
                {t("nav.about")}
              </Link>
              <Link 
                href="/strategy" 
                className="hover:text-brown-light transition-colors"
                prefetch={false}
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '26px',
                }}
              >
                {t("footer.ourStrategy")}
              </Link>
              <Link 
                href="/advantages" 
                className="hover:text-brown-light transition-colors"
                prefetch={false}
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '26px',
                }}
              >
                {t("footer.ourAdvantages")}
              </Link>
              <Link 
                href="/responsibility" 
                className="hover:text-brown-light transition-colors"
                prefetch={false}
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '26px',
                }}
              >
                {t("footer.socialResponsibility")}
              </Link>
              <Link 
                href="/services" 
                className="hover:text-brown-light transition-colors"
                prefetch={false}
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '26px',
                }}
              >
                {t("nav.ourServices")}
              </Link>
          </div>

          <div 
            className="text-white"
            style={{
              fontSize: '16px',
              fontWeight: '400',
              lineHeight: '26px',
              textAlign: 'right',
            }}
          >
            {t("footer.copyright")}
          </div>
        </div>

        {subscription.error && (
          <div className="pt-4 text-center">
            <p className="text-red-400 text-sm">
              {subscription.error === "duplicate"
                ? t("footer.duplicateEmail")
                : t("footer.subscribeError")}
            </p>
          </div>
        )}

        {subscription.success && (
          <div className="pt-4 text-center">
            <p className="text-green-400 text-sm">{t("footer.subscribeSuccess")}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
