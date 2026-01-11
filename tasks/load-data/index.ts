import debug from "debug";

import { promptCountries, promptYears } from "../utils";
import { loaders } from "./loaders";
import { timeout } from "./util";

import { COUNTRY_CONFIG } from "@/utils/countries";
import { fillYears } from "@/utils/date";

const log = debug(`data-loader:run`);

debug.enable("data-loader:*");

const useCountries = await promptCountries("What country to load data for?");

const FETCH_FROM_REMOTE = process.env.FETCH_FROM_REMOTE === "true";

const main = async () => {
  const usedLoaders = useCountries.map((c) => loaders[c]);
  const minYear = useCountries
    .map((c) => COUNTRY_CONFIG[c].minYear)
    .reduce((acc, minYear) => (acc < minYear ? acc : minYear), "9999");

  const processYears = fillYears(minYear, String(new Date().getFullYear()));

  const loadYears = await promptYears(
    "What years to load data for?",
    processYears.toReversed(),
    // only load the last 3 years by default
    processYears.slice(-3),
  );

  await Promise.all(
    usedLoaders.map(async (loader) => {
      if (FETCH_FROM_REMOTE) {
        log(
          `Loading remote data for ${loader.countryCode} for years ${loadYears.join(", ")}`,
        );
        await Promise.all(
          loadYears.map(async (year) => {
            try {
              await loader.prepareCache();
              await loader.loadYearDataToCache(year);
              // add some random delay to avoid hitting rate limits
              await timeout(500 + Math.random() * 5000);
            } catch (error) {
              log(`Error loading ${loader.countryCode} year ${year}`, error);
              // process.exit(1);
            }
          }),
        );
      }

      await loader.run(processYears);
    }),
  );
};

main();
