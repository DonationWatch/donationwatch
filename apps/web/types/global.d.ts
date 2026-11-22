import type { FunctionComponent, SVGAttributes } from "react";

import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";

import type messages from "../src/messages/en.json";

declare module "*.svg" {
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
