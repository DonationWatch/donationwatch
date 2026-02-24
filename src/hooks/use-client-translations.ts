import { useTranslations as useNextIntlTranslations } from "next-intl";

import type { SERVER_ONLY_NAMESPACES } from "@/utils/i18n-filter";
import type {
  Messages,
  NamespaceKeys,
  NestedKeyOf,
  createTranslator,
} from "next-intl";

type ServerOnlyNamespace = (typeof SERVER_ONLY_NAMESPACES)[number];

type ClientMessages = Omit<Messages, ServerOnlyNamespace>;

export function useClientTranslations<
  NestedKey extends NamespaceKeys<ClientMessages, NestedKeyOf<ClientMessages>> =
    never,
>(
  namespace?: NestedKey,
): ReturnType<typeof createTranslator<ClientMessages, NestedKey>> {
  return useNextIntlTranslations(namespace);
}
