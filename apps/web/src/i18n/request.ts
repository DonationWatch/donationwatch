import { DEFAULT_LOCALE } from "@donationwatch/core/utils/locales";
import { isValidLocale } from "@donationwatch/core/utils/validate";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const givenLocale = await requestLocale;
  const locale = !isValidLocale(givenLocale) ? DEFAULT_LOCALE : givenLocale;

  return {
    locale,
    timeZone: "UTC",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
