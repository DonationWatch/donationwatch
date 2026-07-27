import BuildAustralia from "../../data/australia/build";
import BuildAustria from "../../data/austria/build";
import BuildCanada from "../../data/canada/build";
import BuildCroatia from "../../data/croatia/build";
import BuildCzechRepublic from "../../data/czechrepublic/build";
import BuildEstonia from "../../data/estonia/build";
import BuildEuropeanUnion from "../../data/europeanunion/build";
import BuildFrance from "../../data/france/build";
import BuildGeorgia from "../../data/georgia/build";
import BuildGermany from "../../data/germany/build";
import BuildLatvia from "../../data/latvia/build";
import BuildNetherlands from "../../data/netherlands/build";
import BuildNorway from "../../data/norway/build";
import BuildSerbia from "../../data/serbia/build";
import BuildSouthAfrica from "../../data/southafrica/build";
import BuildSweden from "../../data/sweden/build";
import BuildSwitzerland from "../../data/switzerland/build";
import BuildUkraine from "../../data/ukraine/build";
import BuildUnitedKingdom from "../../data/unitedkingdom/build";
import { Country } from "../countries";

const countryDonation: Record<Country, { t: number }> = {
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
};

export const getBuild = (country: Country): { t: number } => {
  return countryDonation[country];
};
