import type { Party, ReceiverId } from "../types";
import type { CountryConfig } from "../countries";
import { Country, COUNTRY_CONFIG } from "../countries";
import { loadCountryData } from "../loader/country-data-loaders";

const partyById = (parties: Party[]): Record<ReceiverId, Party> => {
  return parties.reduce<Record<ReceiverId, Party>>((acc, party) => {
    acc[party.id] = party;
    return acc;
  }, {});
};

const loaded: Record<string, CountryConfig> = {};
export const getCountryConfig = async (
  country: Country,
): Promise<CountryConfig> => {
  // return cached one
  if (loaded[country]) return loaded[country];

  const dataset = await loadCountryData(country, "yearParties");

  const config = {
    ...COUNTRY_CONFIG[country],
    ...dataset,
    partiesById: partyById(dataset.parties),
  };

  loaded[country] = config;
  return config;
};
