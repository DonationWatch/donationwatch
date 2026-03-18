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
  "page_title",
  "per_year",
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
