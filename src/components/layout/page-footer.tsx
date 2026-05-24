"use client";
import Link from "next/link";

import type { ConstLocale } from "@/utils/locales";

import { SocialLinks } from "@/components/layout/social-links";
import { Translation } from "@/components/translation";
import { Button } from "@/components/ui/button";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { BMAC_URL, DATA_LICENSE } from "@/utils/config";

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

        <SocialLinks />

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
