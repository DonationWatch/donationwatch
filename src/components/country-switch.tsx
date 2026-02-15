"use client";

import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { PageLogo } from "./page-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslations } from "../hooks/use-translations";
import { COUNTRIES, COUNTRY_CONFIG, getCountryName } from "../utils/countries";

import type { Country } from "../utils/countries";
import type { PropsWithChildren } from "react";

import { countryFlags } from "@/utils/country-flags";

export const RootLink = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  const { translations, locale } = useTranslations();
  let { country: activeCountry } = useParams<{
    country: Country | undefined;
  }>();

  if (activeCountry && !COUNTRIES.has(activeCountry)) {
    activeCountry = undefined;
  }

  const rootHref = activeCountry ? `/${locale}/${activeCountry}` : `/${locale}`;

  return (
    <Link
      prefetch={false}
      title={translations.header.home}
      href={rootHref}
      className={
        "bg-primary-700 hover:bg-primary-500 flex size-8 shrink-0 items-center justify-center font-semibold text-white " +
        (className ?? "")
      }
    >
      {children}
    </Link>
  );
};

export const CountrySwitch = () => {
  const { translations, locale } = useTranslations();
  let { country: activeCountry } = useParams<{
    country: Country | undefined;
  }>();

  if (activeCountry && !COUNTRIES.has(activeCountry)) {
    activeCountry = undefined;
  }

  return (
    <div className="flex w-full items-center gap-2">
      <RootLink className="rounded">
        <PageLogo size={24} />
      </RootLink>
      <div className="relative grow overflow-hidden text-left">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <button className="group flex w-full cursor-pointer items-center text-left" />
            }
          >
            <div className="grow overflow-hidden leading-none">
              <div className="truncate text-xs">DonationWatch</div>
              <div className="truncate font-semibold">
                {activeCountry
                  ? translations.countries[COUNTRY_CONFIG[activeCountry].code]
                  : translations.sidebar.all_countries}
              </div>
            </div>
            <ChevronDown
              className={
                "shrink-0 rotate-0 transition-transform group-data-[open]:rotate-180"
              }
              size={18}
              aria-hidden={true}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {translations.header.country_selection}
              </DropdownMenuLabel>
              {[...COUNTRIES]
                .toSorted((a, b) => {
                  const translationA =
                    translations.countries[COUNTRY_CONFIG[a].code];
                  const translationB =
                    translations.countries[COUNTRY_CONFIG[b].code];

                  return translationA.localeCompare(translationB);
                })
                .map((country) => {
                  const countryName = getCountryName(
                    { code: COUNTRY_CONFIG[country].code },
                    translations,
                  );
                  return (
                    <DropdownMenuItem
                      key={country}
                      render={
                        <a
                          aria-label={countryName}
                          title={countryName}
                          href={`/${locale}/${country}`}
                          className={`group flex w-full cursor-pointer items-center justify-between rounded py-4 pl-4 text-gray-900 hover:bg-black/10 sm:py-2 dark:hover:bg-white/10 ${
                            activeCountry === country
                              ? "text-primary-700 dark:text-primary-400 font-bold"
                              : "dark:text-gray-100"
                          } data-active:bg-black/10 dark:data-active:bg-white/10`}
                        />
                      }
                    >
                      <span>{countryName}</span>
                      <span
                        className="flex basis-1/4 justify-center"
                        aria-hidden={true}
                      >
                        <Image
                          height={16}
                          className="rounded-xs"
                          src={countryFlags[country]}
                          alt=""
                        />
                      </span>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <a
                    aria-label={translations.sidebar.all_countries}
                    title={translations.sidebar.all_countries}
                    href={`/${locale}/`}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded py-4 pl-4 text-gray-900 hover:bg-black/10 sm:py-2 dark:hover:bg-white/10 ${
                      !activeCountry
                        ? "text-primary-700 dark:text-primary-400 font-bold"
                        : "dark:text-gray-100"
                    } data-active:bg-black/10 dark:data-active:bg-white/10`}
                  />
                }
              >
                <span>{translations.sidebar.all_countries}</span>
                <span
                  className="flex basis-1/4 justify-center"
                  aria-hidden={true}
                >
                  <Globe />
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
