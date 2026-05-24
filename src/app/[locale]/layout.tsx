import type { Metadata } from "next";

import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { OrganizationSchema } from "@/components/schema";
import { Toaster } from "@/components/ui/sonner";
import { SIDENAV_PERSISTENCE_KEY, THUMBNAIL_PREFIX } from "@/utils/config";
import { filterClientMessages } from "@/utils/i18n-filter";
import { LOCALES } from "@/utils/locales";
import { baseOpenGraph, baseTwitter } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidLocale } from "@/utils/validate";

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
          <Providers locale={locale} messages={filterClientMessages(messages)}>
            {children}
          </Providers>
        </NuqsAdapter>
        <Toaster position={"top-center"} />
      </body>
    </html>
  );
}
