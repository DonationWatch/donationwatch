import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import { ExternalRegistryLink } from "@/components/donations/external-registry-link";
import { COUNTRY_CONFIG, Country } from "@/utils/countries";
import { Features, hasFeature } from "@/utils/features";

afterEach(cleanup);

describe("Features.DonorRegistrationNumber", () => {
  test("is enabled on UK country config", () => {
    expect(
      hasFeature(
        COUNTRY_CONFIG[Country.unitedkingdom],
        Features.DonorRegistrationNumber,
      ),
    ).toBe(true);
  });

  test("is enabled on Czech Republic country config", () => {
    expect(
      hasFeature(
        COUNTRY_CONFIG[Country.czechrepublic],
        Features.DonorRegistrationNumber,
      ),
    ).toBe(true);
  });

  test("is enabled on European Union country config", () => {
    expect(
      hasFeature(
        COUNTRY_CONFIG[Country.europeanunion],
        Features.DonorRegistrationNumber,
      ),
    ).toBe(true);
  });
});

describe("ExternalRegistryLink", () => {
  test.each([
    [
      "UK" as const,
      "02366682",
      "https://find-and-update.company-information.service.gov.uk/company/02366682",
    ],
    [
      "CZ" as const,
      "60197501",
      "https://ares.gov.cz/ekonomicke-subjekty/ros/60197501",
    ],
    [
      "BE" as const,
      "0439652401",
      "https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=0439652401",
    ],
    [
      "FR" as const,
      "795039528",
      "https://annuaire-entreprises.data.gouv.fr/entreprise/795039528",
    ],
    [
      "BG" as const,
      "130164711",
      "https://portal.registryagency.bg/CR/en/Reports/ActiveConditionTabResult?uic=130164711",
    ],
    [
      "LU" as const,
      "B180022",
      "https://www.lbr.lu/mjrcs-web-front/consult-company/B180022",
    ],
    [
      "LV" as const,
      "45403058722",
      "https://info.ur.gov.lv/?#/legal-entity/45403058722",
    ],
    [
      "EE" as const,
      "12749460",
      "https://ariregister.rik.ee/eng/company/12749460",
    ],
    [
      "FI" as const,
      "1897609-5",
      "https://tietopalvelu.ytj.fi/yritys/1897609-5",
    ],
  ])("renders link for %s (%s)", (country, registrationNumber, expectedUrl) => {
    render(
      <ExternalRegistryLink
        country={country}
        registrationNumber={registrationNumber}
      >
        <span>{registrationNumber}</span>
      </ExternalRegistryLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(expectedUrl);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("nofollow noopener noreferrer");
    expect(link.textContent).toBe(registrationNumber);
  });

  test("renders plain span fallback for unsupported country", () => {
    const { container } = render(
      <ExternalRegistryLink country="DE" registrationNumber="HRB12345">
        <span>HRB12345</span>
      </ExternalRegistryLink>,
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(container.textContent).toBe("HRB12345");
  });
});
