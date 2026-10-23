import type { ComponentProps, PropsWithChildren } from "react";

import type { Countries } from "@/utils/countries";

const externalRegistryUrls: Partial<
  Record<Countries, (registrationNumber: string) => string>
> = {
  UK: (registrationNumber: string) =>
    `https://find-and-update.company-information.service.gov.uk/company/${registrationNumber}`,
  BE: (registrationNumber: string) =>
    `https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=${registrationNumber}`,
  BG: (registrationNumber: string) =>
    `https://portal.registryagency.bg/CR/en/Reports/ActiveConditionTabResult?uic=${registrationNumber}`,
  CZ: (registrationNumber: string) =>
    `https://ares.gov.cz/ekonomicke-subjekty/ros/${registrationNumber}`,
  EE: (registrationNumber: string) =>
    `https://ariregister.rik.ee/eng/company/${registrationNumber}`,
  FI: (registrationNumber: string) =>
    `https://tietopalvelu.ytj.fi/yritys/${registrationNumber}`,
  FR: (registrationNumber: string) =>
    `https://annuaire-entreprises.data.gouv.fr/entreprise/${registrationNumber}`,
  LU: (registrationNumber: string) =>
    `https://www.lbr.lu/mjrcs-web-front/consult-company/${registrationNumber}`,
  LV: (registrationNumber: string) =>
    `https://info.ur.gov.lv/?#/legal-entity/${registrationNumber}`,
};

export const ExternalRegistryLink = ({
  country,
  registrationNumber,
  children,
  ...props
}: PropsWithChildren<
  {
    country: Countries;
    registrationNumber: string;
  } & ComponentProps<"a">
>) => {
  const externalUrl = externalRegistryUrls[country]?.(registrationNumber);

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
