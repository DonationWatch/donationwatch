import {
  deserializeYears,
  hasKnownYearRange,
} from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { notFound, redirect } from "next/navigation";

export default async function YearPage(
  props: PageProps<"/[locale]/[country]/[years]">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale) || !isValidCountry(params.country)) {
    return notFound();
  }

  const countryConfig = await getCountryConfig(params.country);
  const years = deserializeYears(params.years);

  if (!years.length || !hasKnownYearRange(years, countryConfig)) {
    return notFound();
  }

  // Normalize same-year ranges: e.g. /2023-2023 -> /2023/overview
  const sameYearMatch = params.years.match(/^(\d{4})-(\d{4})$/);
  const targetYears =
    sameYearMatch && sameYearMatch[1] === sameYearMatch[2]
      ? sameYearMatch[1]
      : params.years;

  redirect(`/${params.locale}/${params.country}/${targetYears}/overview`);
}
