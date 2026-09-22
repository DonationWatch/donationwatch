import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import type { CountryConfig } from "@/types/country-config";

import { ExternalDonationLink } from "@/components/donations/external-donation-link";
import { Country } from "@/utils/countries";

afterEach(cleanup);

describe("ExternalDonationLink", () => {
  const ukConfig = {
    id: Country.unitedkingdom,
  } as CountryConfig;

  const lvConfig = {
    id: Country.latvia,
  } as CountryConfig;

  const deConfig = {
    id: Country.germany,
  } as CountryConfig;

  test("renders link for UK donation", () => {
    render(
      <ExternalDonationLink countryConfig={ukConfig} id="C0123456">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(
      "https://search.electoralcommission.org.uk/English/Donations/C0123456",
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("nofollow noopener noreferrer");
    expect(link.textContent).toBe("View source");
  });

  test("renders link for Latvia donation", () => {
    render(
      <ExternalDonationLink countryConfig={lvConfig} id="98765">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(
      "https://info.knab.gov.lv/donations/show?public_id=98765",
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("nofollow noopener noreferrer");
  });

  test("returns null for unsupported country", () => {
    const { container } = render(
      <ExternalDonationLink countryConfig={deConfig} id="12345">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(container.innerHTML).toBe("");
  });
});
