import type { Messages } from "next-intl";

/**
 * Namespaces that are only used in server components (via getTranslations) and should NOT be sent to the client via NextIntlClientProvider.
 */
export const SERVER_ONLY_NAMESPACES = [
  "root",
  "about",
  "privacy",
  "fun",
  "imprint",
  "transparency",
  "page_title",
  "other_countries",
  "home",
  "thanks",
  "export",
  "compare_parties_page",
  "per_year",
  "enterprise",
] as const;

type ServerOnlyNamespace = (typeof SERVER_ONLY_NAMESPACES)[number];

export type ClientMessages = Omit<Messages, ServerOnlyNamespace>;

/**
 * Strips server-only namespaces from the messages object so that only client-relevant translations are sent to NextIntlClientProvider.
 */
export function filterClientMessages(messages: Messages): ClientMessages {
  return Object.fromEntries(
    Object.entries(messages).filter(
      ([key]) => !SERVER_ONLY_NAMESPACES.includes(key as ServerOnlyNamespace),
    ),
  ) as ClientMessages;
}

/**
 * Namespaces required by global layout shells (navigation, sidebar, footer, search, countries list).
 */
export const LAYOUT_NAMESPACES = [
  "navigation",
  "sidebar",
  "search",
  "common",
  "sort",
  "footer",
  "header",
  "actions",
  "countries",
  "ref_countries",
  "data",
  "detect_country",
  "copyright",
  "description",
  "title",
  "sum",
  "donation_count",
  "average",
  "donations_by_party",
  "donations_per_year",
  "party_donations",
  "more",
  "data_since",
  "view_party",
  "faq",
  "over_min_public_amount",
  "over_threshold",
  "prelim_data",
  "donor_dialog",
  "filter",
] as const;

type LayoutNamespace = (typeof LAYOUT_NAMESPACES)[number];

export type LayoutMessages = Pick<Messages, LayoutNamespace>;

export function filterLayoutMessages(messages: Messages): LayoutMessages {
  return Object.fromEntries(
    Object.entries(messages).filter(([key]) =>
      LAYOUT_NAMESPACES.includes(key as LayoutNamespace),
    ),
  ) as LayoutMessages;
}
