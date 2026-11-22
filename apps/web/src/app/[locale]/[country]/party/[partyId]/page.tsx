import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { isValidCountry } from "@donationwatch/core/utils/validate";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { notFound, redirect } from "next/navigation";

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
