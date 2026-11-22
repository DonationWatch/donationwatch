import type { Country } from "@donationwatch/core/utils/countries";
import type { ConstLocale } from "@donationwatch/core/utils/locales";

import { CONST_LOCALES } from "@donationwatch/core/utils/locales";
import cp from "child_process";
import debug from "debug";

import { WEB_DIR } from "../paths";
import { promptCountries } from "../utils";

debug.enable("social-images:*");
const log = debug(`social-images:upload`);

const cwd = WEB_DIR;

const useCountries = await promptCountries(
  "What country to upload social media images for?",
);

const upload = async (locale: ConstLocale, country: Country) => {
  log(`Uploading images for locale ${locale} and country ${country}`);

  // upload language cover image
  cp.execSync(
    `rclone copyto --progress --size-only public/thumbnails/${locale}/cover.png r2-donationwatch-social-images:donationwatch-social-images/${locale}/cover.png`,
    {
      cwd,
      stdio: "inherit",
    },
  );

  // upload locale country images
  cp.execSync(
    `rclone sync --progress --size-only public/thumbnails/${locale}/${country} r2-donationwatch-social-images:donationwatch-social-images/${locale}/${country}`,
    {
      cwd,
      stdio: "inherit",
    },
  );
};

for (const locale of CONST_LOCALES) {
  for (const country of useCountries) {
    await upload(locale, country);
  }
}
