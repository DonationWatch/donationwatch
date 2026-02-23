import { notFound } from "next/navigation";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { THUMBNAIL_PREFIX } from "../../utils/config";
import { LOCALES } from "../../utils/locales";
import { baseOpenGraph, baseTwitter } from "../../utils/meta";
import { notFoundMetadata } from "../../utils/not-found-metadata";
import { isValidLocale } from "../../utils/validate";
import { Providers } from "../providers";

import type { Metadata } from "next";

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

  const [messages] = await Promise.all([getMessages({ locale })]);

  return (
    <html lang={locale} className="scroll-pt-15">
      <body className="min-h-screen w-full">
        <NuqsAdapter>
          <Providers locale={locale} messages={messages}>
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
