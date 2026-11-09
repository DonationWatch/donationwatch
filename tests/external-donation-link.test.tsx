import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import type { CountryConfig } from "@/types/country-config";

import { ExternalDonationLink } from "@/components/donations/external-donation-link";
import { Country } from "@/utils/countries";

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
    const html = renderToStaticMarkup(
      <ExternalDonationLink countryConfig={ukConfig} id="C0123456">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    expect(html).toBe(
      '<a href="https://search.electoralcommission.org.uk/English/Donations/C0123456" rel="nofollow noopener noreferrer" target="_blank"><span>View source</span></a>',
    );
  });

  test("renders link for Latvia donation", () => {
    const html = renderToStaticMarkup(
      <ExternalDonationLink countryConfig={lvConfig} id="98765">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    expect(html).toBe(
      '<a href="https://info.knab.gov.lv/donations/show?public_id=98765" rel="nofollow noopener noreferrer" target="_blank"><span>View source</span></a>',
    );
  });

  test("returns null for unsupported country", () => {
    const html = renderToStaticMarkup(
      <ExternalDonationLink countryConfig={deConfig} id="12345">
        <span>View source</span>
      </ExternalDonationLink>,
    );

    expect(html).toBe("");
  });
});
