import { Country } from "@donationwatch/core/utils/countries";

import BuildAustralia from "../countries/australia/build";
import BuildAustria from "../countries/austria/build";
import BuildCanada from "../countries/canada/build";
import BuildCroatia from "../countries/croatia/build";
import BuildCzechRepublic from "../countries/czechrepublic/build";
import BuildEstonia from "../countries/estonia/build";
import BuildEuropeanUnion from "../countries/europeanunion/build";
import BuildFrance from "../countries/france/build";
import BuildGeorgia from "../countries/georgia/build";
import BuildGermany from "../countries/germany/build";
import BuildLatvia from "../countries/latvia/build";
import BuildNetherlands from "../countries/netherlands/build";
import BuildNorway from "../countries/norway/build";
import BuildSerbia from "../countries/serbia/build";
import BuildSouthAfrica from "../countries/southafrica/build";
import BuildSweden from "../countries/sweden/build";
import BuildSwitzerland from "../countries/switzerland/build";
import BuildUkraine from "../countries/ukraine/build";
import BuildUnitedKingdom from "../countries/unitedkingdom/build";
import BuildUnitedStates from "../countries/unitedstates/build";

export interface BuildMeta {
  // Timestamp of last build that changed donation data or metadata
  t: number;
}

const countryDonation: Record<Country, BuildMeta> = {
  [Country.germany]: BuildGermany,
  [Country.austria]: BuildAustria,
  [Country.switzerland]: BuildSwitzerland,
  [Country.netherlands]: BuildNetherlands,
  [Country.europeanunion]: BuildEuropeanUnion,
  [Country.estonia]: BuildEstonia,
  [Country.czechrepublic]: BuildCzechRepublic,
  [Country.latvia]: BuildLatvia,
  [Country.australia]: BuildAustralia,
  [Country.unitedkingdom]: BuildUnitedKingdom,
  [Country.serbia]: BuildSerbia,
  [Country.croatia]: BuildCroatia,
  [Country.canada]: BuildCanada,
  [Country.georgia]: BuildGeorgia,
  [Country.norway]: BuildNorway,
  [Country.ukraine]: BuildUkraine,
  [Country.france]: BuildFrance,
  [Country.sweden]: BuildSweden,
  [Country.southafrica]: BuildSouthAfrica,
  [Country.unitedstates]: BuildUnitedStates,
};

export const getBuild = (country: Country): BuildMeta => {
  return countryDonation[country];
};
