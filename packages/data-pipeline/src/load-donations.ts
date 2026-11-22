import type { Donation } from "@donationwatch/core/utils/types";

import { Country } from "@donationwatch/core/utils/countries";

const countryDonation: Record<Country, () => Promise<Donation[]>> = {
  [Country.germany]: () =>
    import("./data/de/donations").then((module) => module.default),
  [Country.austria]: () =>
    import("./data/at/donations").then((module) => module.default),
  [Country.switzerland]: () =>
    import("./data/ch/donations").then((module) => module.default),
  [Country.netherlands]: () =>
    import("./data/nl/donations").then((module) => module.default),
  [Country.europeanunion]: () =>
    import("./data/eu/donations").then((module) => module.default),
  [Country.estonia]: () =>
    import("./data/ee/donations").then((module) => module.default),
  [Country.czechrepublic]: () =>
    import("./data/cz/donations").then((module) => module.default),
  [Country.latvia]: () =>
    import("./data/lv/donations").then((module) => module.default),
  [Country.australia]: () =>
    import("./data/au/donations").then((module) => module.default),
  [Country.unitedkingdom]: () =>
    import("./data/uk/donations").then((module) => module.default),
  [Country.serbia]: () =>
    import("./data/rs/donations").then((module) => module.default),
  [Country.croatia]: () =>
    import("./data/hr/donations").then((module) => module.default),
  [Country.canada]: () =>
    import("./data/ca/donations").then((module) => module.default),
  [Country.georgia]: () =>
    import("./data/ge/donations").then((module) => module.default),
  [Country.norway]: () =>
    import("./data/no/donations").then((module) => module.default),
  [Country.ukraine]: () =>
    import("./data/ua/donations").then((module) => module.default),
  [Country.france]: () =>
    import("./data/fr/donations").then((module) => module.default),
  [Country.sweden]: () =>
    import("./data/se/donations").then((module) => module.default),
  [Country.southafrica]: () =>
    import("./data/za/donations").then((module) => module.default),
  [Country.unitedstates]: () =>
    import("./data/us/donations").then((module) => module.default),
};

export const getDonations = async (country: Country): Promise<Donation[]> =>
  countryDonation[country]();
