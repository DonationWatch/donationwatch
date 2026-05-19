"use client";
import Link from "next/link";

import type { ConstLocale } from "@/utils/locales";

import { Github } from "@/components/icons/Github";
import { Translation } from "@/components/translation";
import { Button } from "@/components/ui/button";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  BMAC_URL,
  BSKY_URL,
  DATA_LICENSE,
  GITHUB_URL,
  TWITTER_URL,
} from "@/utils/config";

const currentYear = new Date().getFullYear();

export const PageFooter = ({ locale }: { locale: ConstLocale }) => {
  const t = useTranslations();

  return (
    <footer className="container mx-auto shrink-0 px-4 text-gray-600 dark:text-gray-400">
      <div className="flex grid-cols-3 flex-col gap-2 py-4 text-sm sm:grid sm:flex-row">
        <div className="self-center text-center sm:text-left">
          <span aria-label={t("copyright")}>&copy;</span> {currentYear}{" "}
          DonationWatch
          <div className="mt-1 text-xs">
            <Translation
              t={t}
              translationId={"footer.charts_license"}
              variables={{
                license: (
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-800 dark:hover:text-primary-400"
                  >
                    {DATA_LICENSE}
                  </a>
                ),
              }}
            />
          </div>
        </div>

        <div className="flex items-center self-center sm:justify-center">
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
          <a
            className="hover:text-primary-800 dark:hover:text-primary-400 inline-block p-2 text-gray-500"
            target="_blank"
            title="GitHub"
            href={GITHUB_URL}
            rel="noreferrer"
          >
            <Github />
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Link
              prefetch={false}
              className="hover:text-primary-800 dark:hover:text-primary-400 block"
              href={`/${locale}/imprint`}
            >
              {t("navigation.imprint")}
            </Link>
            <Link
              prefetch={false}
              className="hover:text-primary-800 dark:hover:text-primary-400 block"
              href={`/${locale}/privacy`}
            >
              {t("navigation.privacy")}
            </Link>
            <Link
              prefetch={false}
              className="hover:text-primary-800 dark:hover:text-primary-400 block"
              href={`/${locale}/about`}
            >
              {t("navigation.about")}
            </Link>
          </div>
          <div className="text-center sm:text-end">
            <Button
              variant="secondary"
              size="xs"
              asChild
              className="border-none bg-yellow-400 px-2 text-black shadow-sm hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500"
            >
              <a href={BMAC_URL} target="_blank" rel="noreferrer">
                {t("navigation.support_us")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
