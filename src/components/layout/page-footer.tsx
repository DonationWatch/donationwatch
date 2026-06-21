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

  const rightLinks: { text: string; url: string }[] = [
    {
      text: t("navigation.enterprise"),
      url: `/${locale}/enterprise`,
    },
    {
      text: t("navigation.imprint"),
      url: `/${locale}/imprint`,
    },
    {
      text: t("navigation.privacy"),
      url: `/${locale}/privacy`,
    },
    {
      text: t("navigation.about"),
      url: `/${locale}/about`,
    },
  ];

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
            {rightLinks.map((link) => (
              <Link
                key={link.url}
                prefetch={false}
                className="hover:text-primary-800 dark:hover:text-primary-400 block"
                href={link.url}
              >
                {link.text}
              </Link>
            ))}
          </div>
          <div className="text-center sm:text-end">
            <Button
              variant="secondary"
              size="xs"
              nativeButton={false}
              className="border-none bg-yellow-400 px-2 text-black shadow-sm hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500"
              render={
                <a href={BMAC_URL} target="_blank" rel="noreferrer">
                  {t("navigation.support_us")}
                </a>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
