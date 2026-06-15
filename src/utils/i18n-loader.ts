import type { Messages } from "next-intl";

const messageMap: Record<string, () => Promise<{ default: Messages }>> = {
  cs: () => import("../messages/cs.json"),
  de: () => import("../messages/de.json"),
  en: () => import("../messages/en.json"),
  et: () => import("../messages/et.json"),
  fr: () => import("../messages/fr.json"),
  hr: () => import("../messages/hr.json"),
  lv: () => import("../messages/lv.json"),
  nl: () => import("../messages/nl.json"),
  no: () => import("../messages/no.json"),
  uk: () => import("../messages/uk.json"),
};

export async function getMessagesForLocale(locale: string): Promise<Messages> {
  const loader = messageMap[locale] || messageMap.en;
  return loader().then((mod) => mod.default);
}
