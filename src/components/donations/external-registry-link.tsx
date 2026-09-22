import type { ComponentProps, PropsWithChildren } from "react";

import type { CountryConfig } from "@/types/country-config";

import { Country } from "@/utils/countries";

const externalRegistryUrls: Partial<
  Record<Country, (registrationNumber: string) => string>
> = {
  [Country.unitedkingdom]: (registrationNumber: string) =>
    `https://find-and-update.company-information.service.gov.uk/company/${registrationNumber}`,
};

export const ExternalRegistryLink = ({
  countryConfig,
  registrationNumber,
  children,
  ...props
}: PropsWithChildren<
  {
    countryConfig: CountryConfig;
    registrationNumber: string;
  } & ComponentProps<"a">
>) => {
  const externalUrl =
    externalRegistryUrls[countryConfig.id]?.(registrationNumber);

  if (!externalUrl) {
    return <span>{registrationNumber}</span>;
  }

  return (
    <a
      {...props}
      href={externalUrl}
      rel="nofollow noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
