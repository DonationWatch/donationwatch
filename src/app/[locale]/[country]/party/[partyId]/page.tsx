import { notFound, redirect } from "next/navigation";

import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { isValidCountry } from "@/utils/validate";

export default async function PartyPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]">,
) {
  const params = await props.params;
  if (!isValidCountry(params.country)) return notFound();

  const countryConfig = await getCountryConfig(params.country);
  const subPage = hasFeature(countryConfig, Features.Donors)
    ? "donors"
    : "timeline";

  redirect(
    `/${params.locale}/${params.country}/party/${params.partyId}/${subPage}`,
  );
}
