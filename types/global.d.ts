/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";

import type messages from "../src/messages/en.json";
import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";
import type { FunctionComponent, SVGAttributes } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    fill?: boolean;
  }
}

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
