import type { JSX } from "react";
import type { SatoriOptions } from "satori";

import cp from "child_process";
import fs from "fs/promises";
import { createTranslator } from "next-intl";
import path from "path";
import satori from "satori";
import { fileURLToPath } from "url";
import { afterAll, beforeAll, describe, it } from "vitest";

import type { CountryConfig } from "@/types/country-config";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ImageLocale } from "@/utils/locales";
import type { Donation, DonorMetaDefinition } from "@/utils/types";

import { PartyField } from "@/types/party";
import { makeBrand } from "@/utils/brand";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { getBiggestDonors } from "@/utils/loader/biggest-donors";
import { getParties } from "@/utils/loader/parties";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { CONST_LOCALES } from "@/utils/locales";
import { DonationField } from "@/utils/types";

import type { CreateTranslator } from "./utils";

import { getDonations } from "../data/load-donations";
import { hash } from "../load-data/util";
import { CountryPageImage } from "./images/country-page-image";
import { CountryYearsPageImage } from "./images/country-years-page-image";
import { DonorImage } from "./images/donor-image";
import { PartyPageImage } from "./images/party-page-image";
import { RootPageImage } from "./images/root-page-image";
import { THUMBNAIL_SIZE, toImage } from "./utils";

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

const getDonorsForImages = async (
  countryConfig: CountryConfig,
  donations: Donation[],
  biggestDonors: BigDonor[],
): Promise<BigDonor[]> => {
  const donorsToRender: BigDonor[] = [...biggestDonors];
  const existingDonorIds = new Set(biggestDonors.map((d) => d.id));

  const donorMetaModule = await import(
    `../data/${countryConfig.code.toLowerCase()}/donor-meta.ts`
  ).catch(() => ({ default: { donors: {} } }));
  const donorMeta: DonorMetaDefinition = donorMetaModule.default ?? {
    donors: {},
  };

  if (!donorMeta.donors) return donorsToRender;

  for (const [donorName, meta] of Object.entries(donorMeta.donors)) {
    if (!meta.wiki) continue;
    const id = hash(donorName);
    if (existingDonorIds.has(id)) continue;

    const donorDonations = donations.filter(
      (d) => d[DonationField.DonorName] === donorName,
    );
    if (!donorDonations.length) continue;

    existingDonorIds.add(id);
    donorsToRender.push({
      id,
      name: donorName,
      sum: donorDonations.reduce((acc, d) => acc + d[DonationField.Amount], 0),
      partyYearSums: {},
    });
  }

  return donorsToRender;
};

describe.each(
  CONST_LOCALES.map((locale) => ({ locale: makeBrand<ImageLocale>(locale) })),
)("language $locale", ({ locale }) => {
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

        [countryConfig, donations, yearSums, biggestDonors] = await Promise.all(
          [
            await getCountryConfig(country),
            await getDonations(country),
            await getPartyYearsSums(country),
            await getBiggestDonors(country),
          ],
        );
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

      it(`renders biggest and wiki donors images`, async () => {
        // if there are no donors, skip rendering donor images
        if (!hasFeature(countryConfig, Features.Donors)) return;

        const donors = await getDonorsForImages(
          countryConfig,
          donations,
          biggestDonors,
        );

        for (const donor of donors) {
          const png = await renderComponent(
            await DonorImage(
              locale,
              getTranslations,
              countryConfig,
              donor,
              donations,
            ),
          );

          await fs.writeFile(path.join(DONOR_OUT_DIR, `${donor.id}.png`), png);
        }
      });
      it(`renders country party pages image`, async () => {
        for (const party of await getParties(countryConfig.id)) {
          const png = await renderComponent(
            await PartyPageImage(
              locale,
              getTranslations,
              countryConfig,
              party[PartyField.Id],
              donations,
            ),
          );

          await fs.writeFile(
            path.join(PARTY_OUT_DIR, `${party[PartyField.Id]}.png`),
            png,
          );
        }
      });

      it(`renders country years pages image`, async () => {
        const countryYears = countryConfig.years;

        // year ranges
        for (const years of countryConfig.legislativeYears ?? []) {
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
});
