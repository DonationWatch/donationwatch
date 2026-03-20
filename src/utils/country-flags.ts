import { Country } from "@/utils/countries";

import auFlag from "../../public/flags/au.svg";
import atFlag from "../../public/flags/austria.svg";
import caFlag from "../../public/flags/canada.svg";
import hrFlag from "../../public/flags/croatia.svg";
import czFlag from "../../public/flags/cz.svg";
import eeFlag from "../../public/flags/estonia.svg";
import euFlag from "../../public/flags/eu.svg";
import frFlag from "../../public/flags/fr.svg";
import geFlag from "../../public/flags/georgia.svg";
import deFlag from "../../public/flags/germany.svg";
import lvFlag from "../../public/flags/lv.svg";
import nlFlag from "../../public/flags/netherlands.svg";
import noFlag from "../../public/flags/norway.svg";
import rsFlag from "../../public/flags/serbia.svg";
import chFlag from "../../public/flags/switzerland.svg";
import uaFlag from "../../public/flags/ua.svg";
import ukFlag from "../../public/flags/unitedkingdom.svg";

export const countryFlags: Record<Country, typeof auFlag> = {
  [Country.germany]: deFlag,
  [Country.austria]: atFlag,
  [Country.switzerland]: chFlag,
  [Country.netherlands]: nlFlag,
  [Country.europeanunion]: euFlag,
  [Country.estonia]: eeFlag,
  [Country.czechrepublic]: czFlag,
  [Country.latvia]: lvFlag,
  [Country.australia]: auFlag,
  [Country.unitedkingdom]: ukFlag,
  [Country.serbia]: rsFlag,
  [Country.croatia]: hrFlag,
  [Country.canada]: caFlag,
  [Country.georgia]: geFlag,
  [Country.norway]: noFlag,
  [Country.ukraine]: uaFlag,
  [Country.france]: frFlag,
};
