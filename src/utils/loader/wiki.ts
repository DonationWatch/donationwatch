import type { Country } from "../countries";

export const getWikiArticles = (
  country: Country,
): Promise<{ articles: Record<number, string> }> =>
  import(`../../data/${country}/wikipedia-articles`).then(
    (module) => module.default,
  );
