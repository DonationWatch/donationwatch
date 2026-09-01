"use client";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { CONST_LOCALES } from "@/utils/locales";

const languagesInTheirLanguage: Record<(typeof CONST_LOCALES)[number], string> =
  {
    en: "English",
    de: "Deutsch",
    nl: "Nederlands",
    cs: "Čeština",
    lv: "Latviešu",
    et: "Eesti",
    hr: "Hrvatski",
    no: "Norsk",
    uk: "Українська",
    fr: "Français",
  };

export const LangSwitch = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const [activeLocale, ...path] = pathname.substring(1).split("/");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={t("header.language_selection")}
            title={t("header.language_selection")}
            className="group flex size-10 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-neutral-600/10 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <Languages size={18} />
          </button>
        }
      />
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t("header.language_selection")}
          </DropdownMenuLabel>
          {CONST_LOCALES.map((lang) => (
            <DropdownMenuItem
              key={lang}
              render={
                <a
                  href={`/${[lang, ...path].join("/")}`}
                  className={`group flex w-full cursor-pointer items-center rounded px-4 py-4 text-gray-900 hover:bg-black/10 sm:py-2 dark:hover:bg-white/10 ${
                    activeLocale === lang
                      ? "text-primary-700 dark:text-primary-400 font-bold"
                      : "dark:text-gray-100"
                  } data-active:bg-black/10 dark:data-active:bg-white/10`}
                />
              }
            >
              {languagesInTheirLanguage[lang]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
