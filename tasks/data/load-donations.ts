import { Country } from "../../src/utils/countries";
import { Donation } from "../../src/utils/types";

const countryDonation: Record<Country, () => Promise<Donation[]>> = {
  [Country.germany]: () =>
    import("./de/donations").then((module) => module.default),
  [Country.austria]: () =>
    import("./at/donations").then((module) => module.default),
  [Country.switzerland]: () =>
    import("./ch/donations").then((module) => module.default),
  [Country.netherlands]: () =>
    import("./nl/donations").then((module) => module.default),
  [Country.europeanunion]: () =>
    import("./eu/donations").then((module) => module.default),
  [Country.estonia]: () =>
    import("./ee/donations").then((module) => module.default),
  [Country.czechrepublic]: () =>
    import("./cz/donations").then((module) => module.default),
  [Country.latvia]: () =>
    import("./lv/donations").then((module) => module.default),
  [Country.australia]: () =>
    import("./au/donations").then((module) => module.default),
  [Country.unitedkingdom]: () =>
    import("./uk/donations").then((module) => module.default),
  [Country.serbia]: () =>
    import("./rs/donations").then((module) => module.default),
  [Country.croatia]: () =>
    import("./hr/donations").then((module) => module.default),
  [Country.canada]: () =>
    import("./ca/donations").then((module) => module.default),
  [Country.georgia]: () =>
    import("./ge/donations").then((module) => module.default),
  [Country.norway]: () =>
    import("./no/donations").then((module) => module.default),
  [Country.ukraine]: () =>
    import("./ua/donations").then((module) => module.default),
  [Country.france]: () =>
    import("./fr/donations").then((module) => module.default),
  [Country.sweden]: () =>
    import("./se/donations").then((module) => module.default),
  [Country.southafrica]: () =>
    import("./za/donations").then((module) => module.default),
};

export const getDonations = async (country: Country): Promise<Donation[]> => countryDonation[country]();
