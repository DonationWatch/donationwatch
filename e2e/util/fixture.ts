import { test as base } from "@playwright/test";
import { createTranslator } from "next-intl";

import type { ConstLocale } from "@/utils/locales";
import type { RootTranslator } from "@/utils/translator";

import { Country } from "@/utils/countries";

import type { FixtureProps } from "./props";

import { Accessibility } from "../fixtures/accessibility";
import { ClipboardAccess } from "../fixtures/clipboard-access";
import { DonorPage } from "../fixtures/donor";
import { DonorsPage } from "../fixtures/donors";
import { GlobalSearch } from "../fixtures/global-search";
import { HistoryPage } from "../fixtures/history";
import { HomePage } from "../fixtures/home";
import { Meta } from "../fixtures/meta";
import { Navigation } from "../fixtures/navigation";
import { OriginPage } from "../fixtures/origin";
import { PartyPage } from "../fixtures/party";
import { RootPage } from "../fixtures/root";
import { TimelinePage } from "../fixtures/timeline";
import { Toasts } from "../fixtures/toast";
import { Tools } from "../fixtures/tools";
import { YearOverviewPage } from "../fixtures/year-overview";

type SharedFixtures = {
  homePage: HomePage;
  rootPage: RootPage;

  search: GlobalSearch;
  yearOverviewPage: YearOverviewPage;
  historyPage: HistoryPage;
  donorsPage: DonorsPage;
  timelinePage: TimelinePage;
  originPage: OriginPage;

  donorPage: DonorPage;
  partyPage: PartyPage;
  partyDonorsPage: DonorsPage;

  tools: Tools;

  translations: RootTranslator;
  country: Country;
  accessibility: Accessibility;
  locale: ConstLocale;
  meta: Meta;
  navigation: Navigation;
  clipboardAccess: ClipboardAccess;
  toasts: Toasts;

  props: FixtureProps;
};

export const test = base.extend<SharedFixtures>({
  props: async ({ context, page, translations, locale }, use) =>
    use({
      page,
      translations,
      locale,
      context,
    }),
  translations: async ({ locale }, use) => {
    const currentLocale = locale ?? "en";

    await use(
      createTranslator({
        locale: currentLocale,
        messages: (
          await import(`../../src/messages/${currentLocale}.json`, {
            with: { type: "json" },
          })
        ).default,
      }),
    );
  },
  homePage: async ({ props }, use) => {
    await use(new HomePage(props));
  },
  yearOverviewPage: async ({ props }, use) => {
    await use(new YearOverviewPage(props));
  },
  historyPage: async ({ props }, use) => {
    await use(new HistoryPage(props));
  },
  donorsPage: async ({ props }, use) => {
    await use(new DonorsPage(props));
  },
  timelinePage: async ({ props }, use) => {
    await use(new TimelinePage(props));
  },
  originPage: async ({ props }, use) => {
    await use(new OriginPage(props));
  },
  partyPage: async ({ props }, use) => {
    await use(new PartyPage(props));
  },
  donorPage: async ({ props }, use) => {
    await use(new DonorPage(props));
  },
  search: async ({ props }, use) => {
    await use(new GlobalSearch(props));
  },
  accessibility: async ({ props }, use) => {
    await use(new Accessibility(props));
  },
  meta: async ({ props }, use) => {
    await use(new Meta(props));
  },
  navigation: async ({ props }, use) => {
    await use(new Navigation(props));
  },
  clipboardAccess: async ({ props }, use) => {
    const access = new ClipboardAccess(props);
    await access.register();
    await use(access);
  },
  toasts: async ({ props }, use) => {
    await use(new Toasts(props));
  },
  tools: async ({ props }, use) => {
    await use(new Tools(props));
  },
  rootPage: async ({ props }, use) => {
    await use(new RootPage(props));
  },
  country: [Country.germany, { option: true }],
});
