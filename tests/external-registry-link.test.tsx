import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import type { CountryConfig } from "@/types/country-config";

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
});

describe("ExternalRegistryLink", () => {
  const ukConfig = {
    id: Country.unitedkingdom,
  } as CountryConfig;

  const czConfig = {
    id: Country.czechrepublic,
  } as CountryConfig;

  const deConfig = {
    id: Country.germany,
  } as CountryConfig;

  test("renders link for UK company number", () => {
    render(
      <ExternalRegistryLink
        countryConfig={ukConfig}
        registrationNumber="02366682"
      >
        <span>02366682</span>
      </ExternalRegistryLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(
      "https://find-and-update.company-information.service.gov.uk/company/02366682",
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("nofollow noopener noreferrer");
    expect(link.textContent).toBe("02366682");
  });

  test("renders link for Czech Republic IČO", () => {
    render(
      <ExternalRegistryLink
        countryConfig={czConfig}
        registrationNumber="60197501"
      >
        <span>60197501</span>
      </ExternalRegistryLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(
      "https://ares.gov.cz/ekonomicke-subjekty/ros/60197501",
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("nofollow noopener noreferrer");
    expect(link.textContent).toBe("60197501");
  });

  test("renders plain span fallback for unsupported country", () => {
    const { container } = render(
      <ExternalRegistryLink
        countryConfig={deConfig}
        registrationNumber="HRB12345"
      >
        <span>HRB12345</span>
      </ExternalRegistryLink>,
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(container.textContent).toBe("HRB12345");
  });
});
