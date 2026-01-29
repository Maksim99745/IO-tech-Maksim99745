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

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

export default function Footer() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { subscription } = useAppSelector((state) => state.forms);

  const handleSubmit = async (values: { email: string }, { resetForm }: any) => {
    try {
      dispatch(setSubscriptionLoading(true));
      dispatch(resetSubscription());

      await strapiApi.subscribeEmail(values.email);
      
      dispatch(setSubscriptionSuccess(true));
      resetForm();
      
      setTimeout(() => {
        dispatch(resetSubscription());
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      
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
    <footer className="bg-brown-dark text-white">
      <div className="container mx-auto px-6 md:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-600">
          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-end gap-4">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex gap-2 flex-1 md:flex-initial md:max-w-md">
                  <Field
                    type="email"
                    name="email"
                    placeholder={t("footer.subscribePlaceholder")}
                    className="flex-1 bg-white text-brown-dark px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-light"
                    disabled={subscription.isLoading}
                  />
                  <button
                    type="submit"
                    disabled={subscription.isLoading || isSubmitting}
                    className="bg-brown-dark text-white px-6 py-2 rounded-lg hover:bg-brown-light transition-colors font-medium whitespace-nowrap"
                  >
                    {subscription.isLoading ? t("common.loading") : t("footer.subscribe")}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="flex items-center gap-6">
              <span className="text-white font-medium">{t("nav.contact")}</span>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brown-light transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://plus.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brown-light transition-colors"
                  aria-label="Google Plus"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.635 10.909v2.619h4.335c-.173 1.125-1.31 3.295-4.331 3.295-2.604 0-4.731-2.16-4.731-4.823 0-2.662 2.122-4.822 4.728-4.822 1.485 0 2.533.633 3.113 1.178l2.355-2.276C12.261 4.456 10.219 3.636 7.635 3.636c-4.337 0-7.872 3.493-7.872 7.82 0 4.326 3.537 7.818 7.872 7.818 4.582 0 7.508-3.233 7.508-7.81 0-.528-.057-.931-.13-1.316H7.635zm16.365 0h-2.183V8.726h-2.183v2.183h-2.182v2.183h2.184v2.184h2.189v-2.184H24"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/about" className="hover:text-brown-light transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/strategy" className="hover:text-brown-light transition-colors">
              Our Strategy
            </Link>
            <Link href="/advantages" className="hover:text-brown-light transition-colors">
              Our Advantages
            </Link>
            <Link href="/responsibility" className="hover:text-brown-light transition-colors">
              Social Responsibility
            </Link>
            <Link href="/services" className="hover:text-brown-light transition-colors">
              {t("nav.services")}
            </Link>
          </div>

          <div className="text-sm text-gray-300">
            © 2024. All rights reserved.
          </div>
        </div>

        {subscription.error && (
          <div className="mt-4 text-center">
            <p className="text-red-400 text-sm">
              {subscription.error === "duplicate"
                ? t("footer.duplicateEmail")
                : t("footer.subscribeError")}
            </p>
          </div>
        )}

        {subscription.success && (
          <div className="mt-4 text-center">
            <p className="text-green-400 text-sm">{t("footer.subscribeSuccess")}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
