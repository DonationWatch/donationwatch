import type { Metadata } from "next";

import {
  SIDENAV_PERSISTENCE_KEY,
  THUMBNAIL_PREFIX,
} from "@donationwatch/core/utils/config";
import { LOCALES } from "@donationwatch/core/utils/locales";
import { isValidLocale } from "@donationwatch/core/utils/validate";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { OrganizationSchema } from "@/components/schema";
import { filterLayoutMessages } from "@/utils/i18n-filter";
import { baseOpenGraph, baseTwitter } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { Providers } from "../providers";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;

  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const imageUrl = `${THUMBNAIL_PREFIX}/${locale}/cover.png`;

  return {
    description: t("description"),
    openGraph: baseOpenGraph({
      locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    }),
    twitter: baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    }),
  };
}

export default async function LangLayout(props: LayoutProps<"/[locale]">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;
  const { children } = props;

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="scroll-pt-15" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.ico"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon-dark.svg"
          media="(prefers-color-scheme: dark)"
        />
        <OrganizationSchema />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('${SIDENAV_PERSISTENCE_KEY}') === 'false') {
                  document.documentElement.classList.add('sidebar-collapsed');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen w-full">
        <NuqsAdapter>
          <Providers locale={locale} messages={filterLayoutMessages(messages)}>
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
