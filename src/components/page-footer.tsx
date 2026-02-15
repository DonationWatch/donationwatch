"use server";

import Link from "next/link";

import { Translation } from "./translation";
import { GITHUB_URL } from "../utils/config";

import type { Translations } from "../messages/translations";
import type { ConstLocale } from "../utils/locales";

const currentYear = new Date().getFullYear();

export const PageFooter = async ({
  locale,
  translations,
}: {
  translations: Translations;
  locale: ConstLocale;
}) => {
  return (
    <footer className="container mx-auto shrink-0 px-4 text-gray-600 dark:text-gray-400">
      <div className="flex flex-col justify-between gap-2 py-4 text-sm sm:flex-row">
        <div>
          <span aria-label={translations.copyright}>&copy;</span> {currentYear}{" "}
          DonationWatch
          <div className="mt-1 text-xs">
            <Translation
              text={translations.charts_license}
              variables={{
                license: (
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-800 dark:hover:text-primary-400"
                  >
                    CC BY 4.0
                  </a>
                ),
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap space-x-2">
          <Link
            prefetch={false}
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={`/${locale}/other-countries`}
          >
            {translations.other_countries.title}
          </Link>
          <Link
            prefetch={false}
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={`/${locale}/fun`}
          >
            {translations.fun.link}
          </Link>
          <Link
            prefetch={false}
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={`/${locale}/imprint`}
          >
            {translations.imprint.title}
          </Link>
          <Link
            prefetch={false}
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={`/${locale}/privacy`}
          >
            {translations.privacy.title}
          </Link>
          <Link
            prefetch={false}
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={`/${locale}/about`}
          >
            {translations.about.title}
          </Link>
          <a
            className="hover:text-primary-800 dark:hover:text-primary-400 block"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
