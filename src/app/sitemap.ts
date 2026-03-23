import type { MetadataRoute } from "next";

import type { Country, CountryConfig } from "@/utils/countries";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";

import { BASE_URL } from "@/utils/config";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { getBiggestDonors } from "@/utils/loader/biggest-donors";
import { getBuild } from "@/utils/loader/build";
import {
  getPartyYearsSums,
  lastPartyStatsDonation,
} from "@/utils/loader/party-years-sums";
import { CONST_LOCALES } from "@/utils/locales";

const yearSubPages = [
  "overview",
  "changes",
  "donors",
  "timeline",
  "origin/overview",
];

// Use this to force a minimum last modified date e.g. for important changes that are not reflected in the data
const manualMinLastModified: number = new Date(
  "2024-10-26T07:00:00.000Z",
).getTime();
const lastModified = new Date();

const partySubPages = ["donors", "changes", "timeline", "origin/overview"];

export const dynamic = "force-static";

const countriesArray = [...COUNTRIES];

// generate a sitemap for each locale
export async function generateSitemaps() {
  return CONST_LOCALES.map((locale) => ({ id: locale }));
}

export default async function sitemap(props: {
  id: Promise<ConstLocale>;
}): Promise<MetadataRoute.Sitemap> {
  const locale = await props.id;

  const countryConfigs = (
    await Promise.all(
      countriesArray.map((country) =>
        Promise.all([
          country,
          getCountryConfig(country),
          getPartyYearsSums(country),
          getBuild(country),
          getBiggestDonors(country),
        ]),
      ),
    )
  ).reduce(
    (configs, [country, config, partyYearsSums, build, biggestDonors]) => ({
      ...configs,
      [country]: { config, partyYearsSums, build: build.t, biggestDonors },
    }),
    {} as Record<
      Country,
      {
        config: CountryConfig;
        partyYearsSums: PartyYearsSums;
        build: number;
        biggestDonors: BigDonor[];
      }
    >,
  );

  return [
    ...[locale]
      .flatMap((locale) => {
        return countriesArray
          .flatMap((country) => {
            const { config, partyYearsSums, build, biggestDonors } =
              countryConfigs[country];
            const lastModified = new Date(
              Math.max(manualMinLastModified, build),
            );

            const filledYears = config.years.filter(
              (year) => Object.keys(partyYearsSums[year]).length > 0,
            );

            const filterConditionalSubPages =
              (section: "year" | "party") => (subPage: string) => {
                if (subPage.startsWith("origin"))
                  return hasFeature(config, Features.Origin);
                if (section === "year" && subPage.startsWith("timeline"))
                  return hasFeature(config, Features.Date);

                return true;
              };

            return [
              {
                url: `${BASE_URL}/${locale}`,
                lastModified,
              },
              {
                url: `${BASE_URL}/${locale}/${country}`,
                lastModified,
              },
              {
                url: `${BASE_URL}/${locale}/${country}/tools/data`,
                lastModified,
              },
              {
                url: `${BASE_URL}/${locale}/${country}/tools/bar-chart-race`,
                lastModified,
              },
              {
                url: `${BASE_URL}/${locale}/${country}/tools/compare`,
                lastModified,
              },
              config.parties.flatMap((party) => {
                const partiesBaseUrl = `${BASE_URL}/${locale}/${country}/party/${party.id}`;
                const lastDonation = lastPartyStatsDonation(
                  config,
                  partyYearsSums,
                  {
                    partyId: party.id,
                  },
                );

                return partySubPages
                  .filter((subpage) =>
                    // If there are no donors, don't index the donors page
                    !hasFeature(config, Features.Donors)
                      ? subpage !== "donors"
                      : true,
                  )
                  .filter(filterConditionalSubPages("party"))
                  .map((subPage) => ({
                    url: `${partiesBaseUrl}/${subPage}`,
                    lastModified: lastDonation ?? lastModified,
                  }));
              }),
              filledYears.flatMap((year) => {
                const yearsBaseUrl = `${BASE_URL}/${locale}/${country}/${year}`;
                const lastDonation = lastPartyStatsDonation(
                  config,
                  partyYearsSums,
                  {
                    year,
                  },
                );

                return yearSubPages
                  .filter((subpage) =>
                    // If there are no donors, don't index the donors page
                    !hasFeature(config, Features.Donors)
                      ? subpage !== "donors"
                      : true,
                  )
                  .filter(filterConditionalSubPages("year"))
                  .map((subPage) => ({
                    url: `${yearsBaseUrl}/${subPage}`,
                    lastModified: lastDonation ?? lastModified,
                  }));
              }),
              (config.legislativeYears ?? []).flatMap((years) => {
                const yearsBaseUrl = `${BASE_URL}/${locale}/${country}/${years.at(
                  0,
                )}-${years.at(-1)}`;
                const lastDonation = lastPartyStatsDonation(
                  config,
                  partyYearsSums,
                  {
                    year: years.at(-1),
                  },
                );

                return yearSubPages
                  .filter(filterConditionalSubPages("year"))
                  .map((subPage) => ({
                    url: `${yearsBaseUrl}/${subPage}`,
                    lastModified: lastDonation ?? lastModified,
                  }));
              }),
              biggestDonors
                .filter(() => hasFeature(config, Features.Donors))
                .map((donor) => {
                  const lastDonation = lastPartyStatsDonation(
                    config,
                    donor.partyYearSums,
                  );

                  return {
                    url: `${BASE_URL}/${locale}/${country}/donor/${donor.id}`,
                    lastModified: lastDonation ?? lastModified,
                  };
                }),
            ];
          })
          .concat([
            {
              url: `${BASE_URL}/${locale}/fun`,
              lastModified,
            },
          ]);
      })
      .flat(),
  ];
}
