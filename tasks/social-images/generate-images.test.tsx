import cp from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { createTranslator } from "next-intl";
import satori from "satori";
import { it, describe, beforeAll, afterAll } from "vitest";

import { CountryPageImage } from "./images/country-page-image";
import { CountryYearsPageImage } from "./images/country-years-page-image";
import { DonorImage } from "./images/donor-image";
import { PartyPageImage } from "./images/party-page-image";
import { RootPageImage } from "./images/root-page-image";
import { THUMBNAIL_SIZE, toImage } from "./utils";
import { COUNTRIES } from "../../src/utils/countries";
import { getCountryConfig } from "../../src/utils/data/get-country-config";
import { getBiggestDonors } from "../../src/utils/loader/biggest-donors";
import { getPartyYearsSums } from "../../src/utils/loader/party-years-sums";
import { CONST_LOCALES } from "../../src/utils/locales";
import { getDonations } from "../data/load-donations";

import type { CreateTranslator } from "./utils";
import type { CountryConfig } from "../../src/utils/countries";
import type { BigDonor } from "../../src/utils/loader/biggest-donors";
import type { PartyYearsSums } from "../../src/utils/loader/party-years-sums";
import type { Donation } from "../../src/utils/types";
import type { JSX } from "react";
import type { SatoriOptions } from "satori";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../../public/thumbnails");

const satoriOptions: SatoriOptions = {
  ...THUMBNAIL_SIZE,
  fonts: [
    {
      name: "NotoSans",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSans-Regular.ttf"),
      ),
      style: "normal",
      weight: 400,
    },
    {
      name: "NotoSans",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSans-Medium.ttf"),
      ),
      style: "normal",
      weight: 500,
    },
    {
      name: "NotoSans",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSans-SemiBold.ttf"),
      ),
      style: "normal",
      weight: 600,
    },
    {
      name: "NotoSans",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSans-Bold.ttf"),
      ),
      style: "normal",
      weight: 700,
    },
    {
      name: "NotoSansGeorgian",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSansGeorgian-SemiBold.ttf"),
      ),
      style: "normal",
      weight: 400,
    },
    {
      name: "NotoSansMath",
      data: await fs.readFile(
        path.join(__dirname, "./fonts/NotoSansMath-Regular.ttf"),
      ),
      style: "normal",
      weight: 400,
    },
  ],
};

const renderComponent = async (component: JSX.Element) => {
  const svg = await satori(component, satoriOptions);

  return toImage(svg);
};

describe.each(CONST_LOCALES.map((locale) => ({ locale })))(
  "language $locale",
  ({ locale }) => {
    const LOCALE_OUT_DIR = path.join(OUT_DIR, locale);
    let getTranslations: CreateTranslator;

    beforeAll(async () => {
      await fs.mkdir(LOCALE_OUT_DIR, { recursive: true });

      const messages = (
        await import(`../../src/messages/${locale}.json`, {
          with: { type: "json" },
        })
      ).default;

      getTranslations = (namespace?: string) =>
        createTranslator({
          locale,
          namespace,
          messages,
        });
    });

    afterAll(async () => {
      const command = `oxipng -o 2 --strip safe ${path.join(LOCALE_OUT_DIR, `cover.png`)}`;
      console.log(`Optimizing cover with command: ${command}`);
      cp.execSync(command, {
        stdio: "inherit",
      });
    });

    it("renders root page image", async () => {
      const countriesArray = [...COUNTRIES];

      const countryDatas = await Promise.all(
        countriesArray.map((country) =>
          Promise.all([
            country,
            getCountryConfig(country),
            getPartyYearsSums(country),
          ]),
        ),
      );

      const png = await renderComponent(
        await RootPageImage(locale, getTranslations, countryDatas),
      );

      await fs.writeFile(path.join(LOCALE_OUT_DIR, `cover.png`), png);
    });

    describe.each([...COUNTRIES].map((country) => ({ country })))(
      `country $country`,
      ({ country }) => {
        const COUNTRY_OUT_DIR = path.join(LOCALE_OUT_DIR, country);
        const PARTY_OUT_DIR = path.join(COUNTRY_OUT_DIR, "parties");
        const YEARS_OUT_DIR = path.join(COUNTRY_OUT_DIR, "years");
        const DONOR_OUT_DIR = path.join(COUNTRY_OUT_DIR, "donors");
        let donations: Donation[];
        let countryConfig: CountryConfig;
        let yearSums: PartyYearsSums;
        let biggestDonors: BigDonor[];

        beforeAll(async () => {
          await fs.rm(COUNTRY_OUT_DIR, { recursive: true, force: true });
          await fs.mkdir(PARTY_OUT_DIR, { recursive: true });
          await fs.mkdir(YEARS_OUT_DIR, { recursive: true });
          await fs.mkdir(DONOR_OUT_DIR, { recursive: true });
          [countryConfig, donations, yearSums, biggestDonors] =
            await Promise.all([
              await getCountryConfig(country),
              await getDonations(country),
              await getPartyYearsSums(country),
              await getBiggestDonors(country),
            ]);
        });

        afterAll(async () => {
          const command = `oxipng -o 2 --strip safe ${COUNTRY_OUT_DIR}/**/*.png`;
          console.log(`Optimizing images with command: ${command}`);
          cp.execSync(command, {
            stdio: "inherit",
          });
        });

        it(`renders country page image`, async () => {
          const png = await renderComponent(
            await CountryPageImage(
              locale,
              getTranslations,
              countryConfig,
              yearSums,
            ),
          );

          await fs.writeFile(path.join(COUNTRY_OUT_DIR, `cover.png`), png);
        });

        it(`renders biggest donors images`, async () => {
          for (const donor of biggestDonors) {
            const png = await renderComponent(
              await DonorImage(
                locale,
                getTranslations,
                countryConfig,
                donor,
                donations,
              ),
            );

            await fs.writeFile(
              path.join(DONOR_OUT_DIR, `${donor.id}.png`),
              png,
            );
          }
        });

        it(`renders country party pages image`, async () => {
          for (const party of countryConfig.parties) {
            const png = await renderComponent(
              await PartyPageImage(
                locale,
                getTranslations,
                countryConfig,
                party.id,
                donations,
              ),
            );

            await fs.writeFile(
              path.join(PARTY_OUT_DIR, `${party.id}.png`),
              png,
            );
          }
        });

        it(`renders country years pages image`, async () => {
          const countryYears = countryConfig.years;

          // year ranges
          for (const years of countryConfig.legislativeYears) {
            const png = await renderComponent(
              await CountryYearsPageImage(
                locale,
                getTranslations,
                countryConfig,
                donations,
                years,
                yearSums,
              ),
            );

            await fs.writeFile(
              path.join(YEARS_OUT_DIR, `${years.at(0)}-${years.at(-1)}.png`),
              png,
            );
          }

          // singular years
          for (const year of countryYears) {
            // check if year is in the future and skip
            if (year > `${new Date().getFullYear()}`) {
              continue;
            }

            const png = await renderComponent(
              await CountryYearsPageImage(
                locale,
                getTranslations,
                countryConfig,
                donations,
                [year],
                yearSums,
              ),
            );

            await fs.writeFile(path.join(YEARS_OUT_DIR, `${year}.png`), png);
          }
        });
      },
    );
  },
);
