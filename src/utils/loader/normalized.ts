import type { Country } from "../countries";

export const getTransparency = async (
  country: Country,
): Promise<{
  filteredDonors: string[];
  normalizedDonors: Record<string, string[]>;
}> =>
  import(`../../data/${country}/transparency`).then((module) => module.default);
