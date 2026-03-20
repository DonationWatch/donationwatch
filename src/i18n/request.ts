import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/utils/locales";
import { isValidLocale } from "@/utils/validate";

export default getRequestConfig(async ({ requestLocale }) => {
  const givenLocale = await requestLocale;
  const locale = !isValidLocale(givenLocale) ? DEFAULT_LOCALE : givenLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
