import type { Country } from "@donationwatch/core/utils/countries";

export const getWikiArticles = (
  country: Country,
): Promise<{ articles: Record<number, string> }> =>
  import(`../countries/${country}/wikipedia-articles.ts`).then(
    (module) => module.default,
  );
