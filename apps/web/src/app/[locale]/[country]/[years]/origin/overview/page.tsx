import type { Metadata } from "next";

import { deserializeYears } from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { generateAlternates } from "@/utils/meta";

import { YearsOriginClientPage } from "./_components/years-origin-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/origin/overview">,
): Promise<Metadata> {
  const params = await props.params;

  const { country, years } = params;

  return {
    alternates: generateAlternates(`${country}/${years}/origin/overview`),
  };
}

export default async function OverviewPage(
  props: PageProps<"/[locale]/[country]/[years]/origin/overview">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const years = deserializeYears(params.years);

  return <YearsOriginClientPage years={years} />;
}
