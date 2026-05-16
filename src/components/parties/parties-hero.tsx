import type { CSSProperties } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { FormattedCountryCurrency } from "@/components/browser-based-formatter";
import { PartyField, type Party } from "@/types/party";
import { partyColor } from "@/utils/color";

const VISIBLE_PARTIES = 4;

const PartyLinkPill = ({
  country,
  party,
  locale,
}: {
  party: Party;
  locale: ConstLocale;
  country: CountryConfig;
}) => {
  const color = partyColor(party[PartyField.Id], country);
  return (
    <li className="basis-full overflow-hidden p-1 sm:basis-1/2 lg:basis-1/4">
      <Link
        href={`/${locale}/${country.id}/party/${party[PartyField.Id]}/donors`}
        className={`flex rounded-md bg-white p-2 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md hover:saturate-100 dark:bg-gray-900 dark:hover:bg-gray-950`}
      >
        <div
          className="w-2 rounded-full border bg-linear-to-br from-indigo-900 to-indigo-700 saturate-80"
          style={
            {
              borderColor: color,
              "--tw-gradient-to": `color-mix(in srgb, ${color} 90%, black)`,
              "--tw-gradient-from": `color-mix(in srgb, ${color} 90%, white)`,
            } as CSSProperties
          }
        ></div>
        <div className="overflow-hidden pl-2 text-sm">
          <div className="truncate font-bold">{party[PartyField.Short]}</div>
          <div className="tabular-nums">
            <FormattedCountryCurrency
              country={country}
              value={party[PartyField.Sum]}
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export const PartiesHero = ({
  country,
  locale,
}: {
  country: CountryConfig;
  locale: ConstLocale;
}) => {
  const tHome = useTranslations("home");
  const allParties = country.parties.toSorted(
    (a, b) => b[PartyField.Sum] - a[PartyField.Sum],
  );

  return (
    <>
      <ul className="flex flex-wrap">
        {allParties.slice(0, VISIBLE_PARTIES).map((party) => (
          <PartyLinkPill
            country={country}
            key={party[PartyField.Id]}
            party={party}
            locale={locale}
          />
        ))}
      </ul>
      <details className="mt-4">
        <summary className="cursor-pointer select-none">
          {tHome("parties.more")}
        </summary>
        <ul className="flex flex-wrap pt-4">
          {allParties.slice(VISIBLE_PARTIES).map((party) => (
            <PartyLinkPill
              country={country}
              key={party[PartyField.Id]}
              party={party}
              locale={locale}
            />
          ))}
        </ul>
      </details>
    </>
  );
};
