"use client";

import Link from "next/link";

import { PageLogo } from "./page-logo";
import { t } from "../app/[locale]/translations";
import { BSKY_URL, GITHUB_URL, TWITTER_URL } from "../utils/config";
import { formatDate } from "../utils/formatter";
import { getBuild } from "../utils/loader/build";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { FC } from "react";

export const CountryFooter: FC<{
  translations: Translations;
  country: CountryConfig;
  locale: ConstLocale;
}> = ({ locale, country, translations }) => {
  return (
    <section className="container mx-auto shrink-0 px-4 text-gray-600 dark:text-gray-400">
      <div className="grid grid-cols-2 items-start justify-between py-4 sm:grid-cols-3 sm:justify-items-center">
        <div className="col-span-2 sm:col-span-1 sm:justify-self-start">
          <div className="flex justify-between sm:block">
            <Link
              prefetch={false}
              href={`/${locale}/${country.id}`}
              className="group hover:text-primary-700 dark:hover:text-primary-400 flex items-center space-x-1 p-2 dark:text-white"
            >
              <PageLogo size={16} />
              <div className="text-sm font-semibold">DonationWatch</div>
            </Link>
            <ul className="mt-2">
              <li className="inline-block">
                <a
                  className="hover:text-primary-800 dark:hover:text-primary-400 inline-block p-2 text-gray-500"
                  target="_blank"
                  title="Bluesky"
                  href={BSKY_URL}
                  rel="noreferrer"
                >
                  <svg
                    width="16px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M12 10.8c-1-2.1-4-6-6.8-8C2.6 1 1.6 1.3.9 1.6.1 1.9 0 3 0 3.8c0 .7.4 5.6.6 6.4C1.4 13 4.3 14 7 13.6c-4 .6-7.4 2-2.8 7 5 5.3 6.8-1 7.8-4.2 1 3.2 2 9.3 7.7 4.3 4.3-4.3 1.2-6.5-2.7-7a8.7 8.7 0 0 1-.4-.1h.4c2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.7.6-6.4 0-.7-.1-1.9-.9-2.2-.7-.3-1.7-.7-4.3 1.2-2.8 2-5.7 5.9-6.8 8Z"
                    />
                  </svg>
                </a>
              </li>
              <li className="inline-block">
                <a
                  className="hover:text-primary-800 dark:hover:text-primary-400 inline-block p-2 text-gray-500"
                  target="_blank"
                  title="Twitter"
                  href={TWITTER_URL}
                  rel="noreferrer"
                >
                  <svg
                    width="16px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M18.9 1.15h3.68l-8.04 9.2L24 22.84h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.6l5.24 6.94Zm-1.29 19.5h2.04L6.49 3.23h-2.2Z"
                    />
                  </svg>
                </a>
              </li>
              <li className="inline-block">
                <a
                  className="hover:text-primary-800 dark:hover:text-primary-400 inline-block p-2 text-gray-500"
                  target="_blank"
                  title="GitHub"
                  href={GITHUB_URL}
                  rel="noreferrer"
                >
                  <svg
                    width="16px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-2 text-sm">
          {t(translations.footer.build, {
            date: formatDate(locale, new Date(getBuild(country.id).t)),
          })}
        </div>

        <div className="flex flex-col items-end justify-self-end">
          <a
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            target="_blank"
            href={country.source.url}
            rel="noreferrer"
          >
            {translations.footer.sources}
          </a>
          <Link
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            href={`/${locale}/${country.id}/transparency`}
            prefetch={false}
            rel="nofollow"
          >
            {translations.transparency.title}
          </Link>
        </div>
      </div>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
    </section>
  );
};
