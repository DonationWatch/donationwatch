import type { Country } from "@donationwatch/core/utils/countries";

import { CONTACT_MAIL, PROD_URL } from "@donationwatch/core/utils/config";
import fs from "fs/promises";
import path from "path";

import { DATA_COUNTRIES_DIR } from "../paths";
import { jsonAsTsModule } from "../utils";

const DATA_DIR = DATA_COUNTRIES_DIR;

export const writeWikipediaArticles = async (
  countryId: Country,
  articles: Record<number, string>,
) => {
  await fs.writeFile(
    path.join(DATA_DIR, `${countryId}/wikipedia-articles.ts`),
    jsonAsTsModule(JSON.stringify({ articles })),
    { encoding: "utf8" },
  );
};

const USER_AGENT = `DonationWatch/0.1 (${PROD_URL}; ${CONTACT_MAIL}) Node.js/${process.version}`;

const okFetchJson = (url: string) =>
  fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Api-User-Agent": USER_AGENT,
    },
  }).then((resp) => {
    if (!resp.ok) throw new Error(`Unable to load ${url}: ${resp.status}`);
    return resp.json();
  });

// get the short description for a given wikipedia page
export const loadWikipediaPageExtract = async (
  wikiCountry: string,
  pageId: number,
): Promise<[number, string] | undefined> => {
  try {
    const url = `https://${wikiCountry}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&pageids=${pageId}`;
    console.log("Loading Wikipedia summary from", url);
    const json2 = (await okFetchJson(url)) as {
      query: { pages: Record<number, { extract: string }> };
    };

    let article = json2.query.pages[pageId].extract;
    if (!article) return undefined;

    article = article.split("\n\n")[0];
    if (!article.length) return undefined;

    return [pageId, article];
  } catch (e) {
    console.error("Failed loading wikipedia summary", e);
    return undefined;
  }
};
