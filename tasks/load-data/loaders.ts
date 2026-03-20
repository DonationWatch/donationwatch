import { Country } from "@/utils/countries";

import type { DataLoader } from "./data-loader";

import { AtLoader } from "./at/at-loader";
import { AuLoader } from "./au/au-loader";
import { CaLoader } from "./ca/ca-loader";
import { ChLoader } from "./ch/ch-loader";
import { CzLoader } from "./cz/cz-loader";
import { DeLoader } from "./de/de-loader";
import { EeLoader } from "./ee/ee-loader";
import { EuLoader } from "./eu/eu-loader";
import { FrLoader } from "./fr/fr-loader";
import { GeLoader } from "./ge/ge-loader";
import { HrLoader } from "./hr/hr-loader";
import { LvLoader } from "./lv/lv-loader";
import { NlLoader } from "./nl/nl-loader";
import { NoLoader } from "./no/no-loader";
import { RsLoader } from "./rs/rs-loader";
import { UaLoader } from "./ua/ua-loader";
import { UkLoader } from "./uk/uk-loader";

export const loaders: Record<Country, DataLoader> = {
  [Country.germany]: new DeLoader(),
  [Country.europeanunion]: new EuLoader(),
  [Country.austria]: new AtLoader(),
  [Country.switzerland]: new ChLoader(),
  [Country.netherlands]: new NlLoader(),
  [Country.estonia]: new EeLoader(),
  [Country.czechrepublic]: new CzLoader(),
  [Country.latvia]: new LvLoader(),
  [Country.australia]: new AuLoader(),
  [Country.unitedkingdom]: new UkLoader(),
  [Country.serbia]: new RsLoader(),
  [Country.croatia]: new HrLoader(),
  [Country.canada]: new CaLoader(),
  [Country.georgia]: new GeLoader(),
  [Country.norway]: new NoLoader(),
  [Country.ukraine]: new UaLoader(),
  [Country.france]: new FrLoader(),
};
