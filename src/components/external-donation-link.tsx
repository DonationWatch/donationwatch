import type { CountryConfig } from "@/utils/countries";
import type { ComponentProps, PropsWithChildren } from "react";

import { Country } from "@/utils/countries";

const externalUrls: Partial<Record<Country, (id: string) => string>> = {
  [Country.unitedkingdom]: (id: string) =>
    `https://search.electoralcommission.org.uk/English/Donations/${id}`,
};

export const ExternalDonationLink = ({
  countryConfig,
  id,
  children,
  ...props
}: PropsWithChildren<
  {
    countryConfig: CountryConfig;
    id: string;
  } & ComponentProps<"a">
>) => {
  const externalUrl = externalUrls[countryConfig.id]?.(id);

  if (!externalUrl) return null;

  return (
    <a {...props} href={externalUrl} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
};
