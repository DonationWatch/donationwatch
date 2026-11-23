import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Country } from "@donationwatch/core/utils/countries";
import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { BigDonor } from "@donationwatch/data/loader/biggest-donors";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import type { MetadataRoute } from "next";

import { PartyField } from "@donationwatch/core/types/party";
import { BASE_URL } from "@donationwatch/core/utils/config";
import { COUNTRIES } from "@donationwatch/core/utils/countries";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { CONST_LOCALES } from "@donationwatch/core/utils/locales";
import { lastPartyStatsDonation } from "@donationwatch/core/utils/party";
import { getPartiesSync } from "@donationwatch/data/config/parties";
import { getBiggestDonors } from "@donationwatch/data/loader/biggest-donors";
import { getBuild } from "@donationwatch/data/loader/build";
import { getPartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import { getWikiDonors } from "@donationwatch/data/loader/wiki-donors";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";

const yearSubPages = ["overview", "donors", "origin/overview"];

// Use this to force a minimum last modified date e.g. for important changes that are not reflected in the data
const manualMinLastModified: number = new Date(
  "2026-11-22T00:00:00.000Z",
).getTime();
const lastModified = new Date();

const clampLastModified = (
  date: string | Date | undefined,
  fallback: Date,
): Date => {
  const timestamp = date ? new Date(date).getTime() : fallback.getTime();
  return new Date(
    Math.max(
      manualMinLastModified,
      Number.isNaN(timestamp) ? fallback.getTime() : timestamp,
    ),
  );
};

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
          getWikiDonors(country),
        ]),
      ),
    )
  ).reduce(
    (
      configs,
      [country, config, partyYearsSums, build, biggestDonors, wikiDonors],
    ) => ({
      ...configs,
      [country]: {
        config,
        partyYearsSums,
        build: build.t,
        biggestDonors,
        wikiDonors,
      },
    }),
    {} as Record<
      Country,
      {
        config: CountryConfig;
        partyYearsSums: PartyYearsSums;
        build: number;
        biggestDonors: BigDonor[];
        wikiDonors: BigDonor[];
      }
    >,
  );

  return [locale]
    .flatMap((locale) => {
      return [
        {
          url: `${BASE_URL}/${locale}`,
          lastModified,
        },
        {
          url: `${BASE_URL}/${locale}/about`,
          lastModified,
        },
        {
          url: `${BASE_URL}/${locale}/other-countries`,
          lastModified,
        },
        {
          url: `${BASE_URL}/${locale}/enterprise`,
          lastModified,
        },
        ...countriesArray.flatMap((country) => {
          const { config, partyYearsSums, build, biggestDonors, wikiDonors } =
            countryConfigs[country];
          const lastModified = new Date(Math.max(manualMinLastModified, build));

          const filledYears = config.years.filter(
            (year) => Object.keys(partyYearsSums[year]).length > 0,
          );

          const filterConditionalSubPages = (subPage: string) => {
            if (subPage.startsWith("donors"))
              return hasFeature(config, Features.Donors);
            if (subPage.startsWith("origin"))
              return hasFeature(config, Features.Origin);

            return true;
          };

          return [
            {
              url: `${BASE_URL}/${locale}/${country}`,
              lastModified,
            },
            {
              url: `${BASE_URL}/${locale}/${country}/tools/data`,
              lastModified,
            },
            {
              url: `${BASE_URL}/${locale}/${country}/methodology`,
              lastModified,
            },
            ...(hasFeature(config, Features.Date)
              ? [
                  {
                    url: `${BASE_URL}/${locale}/${country}/tools/bar-chart-race`,
                    lastModified,
                  },
                ]
              : []),
            {
              url: `${BASE_URL}/${locale}/${country}/tools/compare`,
              lastModified,
            },
            getPartiesSync(country).flatMap((party) => {
              const partiesBaseUrl = `${BASE_URL}/${locale}/${country}/party/${party[PartyField.Id]}`;
              const lastDonation = lastPartyStatsDonation(
                getBuild(config.id).t,
                partyYearsSums,
                {
                  partyId: party[PartyField.Id],
                },
              );

              const primaryPartySubPage = hasFeature(config, Features.Donors)
                ? "donors"
                : "timeline";

              return [
                {
                  url: `${partiesBaseUrl}/${primaryPartySubPage}`,
                  lastModified: clampLastModified(lastDonation, lastModified),
                },
              ];
            }),
            filledYears.flatMap((year) => {
              const yearsBaseUrl = `${BASE_URL}/${locale}/${country}/${year}`;
              const lastDonation = lastPartyStatsDonation(
                getBuild(config.id).t,
                partyYearsSums,
                {
                  year,
                },
              );

              return yearSubPages
                .filter(filterConditionalSubPages)
                .map((subPage) => ({
                  url: `${yearsBaseUrl}/${subPage}`,
                  lastModified: clampLastModified(lastDonation, lastModified),
                }));
            }),
            (config.legislativeYears ?? []).flatMap((years) => {
              const yearsBaseUrl = `${BASE_URL}/${locale}/${country}/${years.at(
                0,
              )}-${years.at(-1)}`;
              const lastDonation = lastPartyStatsDonation(
                getBuild(config.id).t,
                partyYearsSums,
                {
                  year: years.at(-1),
                },
              );

              return yearSubPages
                .filter(filterConditionalSubPages)
                .map((subPage) => ({
                  url: `${yearsBaseUrl}/${subPage}`,
                  lastModified: clampLastModified(lastDonation, lastModified),
                }));
            }),
            (() => {
              if (!hasFeature(config, Features.Donors)) return [];

              const seenDonorIds = new Set<string>();
              const sitemapDonors = [];

              for (const donor of [...biggestDonors, ...wikiDonors]) {
                if (seenDonorIds.has(donor.id)) continue;
                seenDonorIds.add(donor.id);

                const lastDonation = lastPartyStatsDonation(
                  getBuild(config.id).t,
                  donor.partyYearSums,
                );

                sitemapDonors.push({
                  url: `${BASE_URL}/${locale}/${country}/donor/${donor.id}`,
                  lastModified: clampLastModified(lastDonation, lastModified),
                });
              }

              return sitemapDonors;
            })(),
          ];
        }),
        {
          url: `${BASE_URL}/${locale}/fun`,
          lastModified,
        },
      ];
    })
    .flat();
}
