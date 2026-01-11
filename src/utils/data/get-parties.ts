import type { CountryConfig } from "../countries";

export const getParties = (country: CountryConfig, years: string[]) => {
  const yearsSet = new Set(years);
  return country.parties.filter((party) =>
    party.years.some((year) => yearsSet.has(year)),
  );
};
