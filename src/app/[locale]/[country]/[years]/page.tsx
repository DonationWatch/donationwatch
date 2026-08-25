import { notFound, redirect } from "next/navigation";

import { getCountryConfig } from "@/utils/data/get-country-config";
import { deserializeYears, hasKnownYearRange } from "@/utils/serializers";
import { isValidCountry, isValidLocale } from "@/utils/validate";

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
