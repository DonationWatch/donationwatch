import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";
import type { Donation, DonorMetaDefinition } from "@/utils/types";

import { getCountryConfig } from "@/utils/data/get-country-config";
import { DonationField } from "@/utils/types";

import { getDonations } from "../data/load-donations";
import { loaders } from "../load-data/loaders";
import { timeout } from "../load-data/util";
import { promptCountries } from "../utils";
import { loadWikipediaPageExtract, writeWikipediaArticles } from "./util";

const populateDonationWikipediaData = async (
  country: CountryConfig,
  donations: Donation[],
  donorMeta: DonorMetaDefinition,
) => {
  const donors: Record<string, number> = {};

  donations.forEach((donation) => {
    donors[donation[DonationField.DonorName]] ??= 0;
    donors[donation[DonationField.DonorName]]++;
  });

  const wikiSummaries: {
    articles: Record<number, string>;
  } = {
    articles: {},
  };

  const loadedDonorArticles: Record<string, boolean> = {};
  const wikiCountry = country.wikiCountry;

  const donorsWithWikipedia = Object.keys(donors).filter(
    (donor) => donors[donor] >= 2,
  );

  console.log(
    `Donors with more than 2 donations: ${donorsWithWikipedia.length}`,
  );
  console.log(donorsWithWikipedia);
  console.log("");

  for (const [donorName, meta] of Object.entries(donorMeta.donors)) {
    const pageId = meta.wiki;

    // only load summary from wiki if we didn't already load it
    if (loadedDonorArticles[donorName]) continue;

    // skip if donor has no wiki page
    if (!pageId) continue;

    const result = await loadWikipediaPageExtract(wikiCountry, pageId);
    if (result) {
      const [pageId, article] = result;
      wikiSummaries.articles[pageId] = article;
      loadedDonorArticles[donorName] = true;
    }
    await timeout(1000);
  }

  for (const party of country.parties) {
    // skip if party has no wiki page
    if (!party.wiki) continue;

    const result = await loadWikipediaPageExtract(wikiCountry, party.wiki);
    await timeout(1000);
    if (result) {
      const [pageId, article] = result;
      wikiSummaries.articles[pageId] = article;
    }
  }

  await writeWikipediaArticles(country.id, wikiSummaries.articles);
};

const useCountries = await promptCountries(
  "What country to load wikipedia articles for?",
);

const main = async () => {
  const articles = useCountries.map<[Country, DonorMetaDefinition]>((c) => [
    c,
    loaders[c].donorMeta,
  ]);

  for (const [country, donorIds] of articles) {
    const countryConfig = await getCountryConfig(country);
    const data = await getDonations(country);

    await populateDonationWikipediaData(countryConfig, data, donorIds);
  }
};

main();
