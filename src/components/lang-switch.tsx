"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import { useTranslations } from "../hooks/use-translations";
import { CONST_LOCALES } from "../utils/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const languagesInTheirLanguage: Record<(typeof CONST_LOCALES)[number], string> =
  {
    en: "English",
    de: "Deutsch",
    nl: "Nederlands",
    cs: "Čeština",
    lv: "Latviešu",
    et: "Eestlane",
    hr: "Hrvatski",
    no: "Norsk",
  };

export const LangSwitch = () => {
  const { translations } = useTranslations();
  const pathname = usePathname();

  const [activeLocale, ...path] = pathname.substring(1).split("/");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={translations.header.language_selection}
            title={translations.header.language_selection}
            className="group flex size-10 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-neutral-600/10"
          />
        }
      >
        <Languages size={18} aria-hidden={true} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {translations.header.language_selection}
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
