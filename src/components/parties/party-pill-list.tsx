"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { Card } from "@/components/ui/card";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { PartyField, type Party } from "@/types/party";
import { formatCountryCurrency } from "@/utils/formatter";

const VISIBLE_PARTIES = 4;

const PartyLinkPill = ({
  country,
  party,
  locale,
  sum,
}: {
  party: Party;
  locale: ConstLocale;
  country: CountryConfig;
  sum: string;
}) => {
  const color = party[PartyField.Color];
  return (
    <li className="basis-full overflow-hidden p-1 sm:basis-1/2 lg:basis-1/4">
      <Card
        variant="action"
        className="flex rounded-md p-2 hover:saturate-100"
        render={
          <Link
            href={`/${locale}/${country.id}/party/${party[PartyField.Id]}/donors`}
          />
        }
      >
        <div
          className="w-2 rounded-full border saturate-80"
          style={{
            borderColor: color,
            background: `linear-gradient(135deg, color-mix(in srgb, ${color} 90%, white), color-mix(in srgb, ${color} 90%, black))`,
          }}
        />
        <div className="overflow-hidden pl-2 text-sm">
          <div className="truncate font-bold">{party[PartyField.Short]}</div>
          <div className="tabular-nums">{sum}</div>
        </div>
      </Card>
    </li>
  );
};

export const PartyPillList = ({
  allParties,
  country,
  locale,
}: {
  allParties: Party[];
  country: CountryConfig;
  locale: ConstLocale;
}) => {
  const tHome = useTranslations("home");
  const browserBasedLocale = useBrowserBasedLocale();

  const formatSum = (party: Party) =>
    formatCountryCurrency(browserBasedLocale, party[PartyField.Sum], country);

  const visibleParties = allParties.slice(0, VISIBLE_PARTIES);
  const remainingParties = allParties.slice(VISIBLE_PARTIES);

  return (
    <>
      <ul className="flex flex-wrap">
        {visibleParties.map((party) => (
          <PartyLinkPill
            country={country}
            key={party[PartyField.Id]}
            party={party}
            locale={locale}
            sum={formatSum(party)}
          />
        ))}
      </ul>
      {remainingParties.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer select-none">
            {tHome("parties.more")}
          </summary>
          <ul className="flex flex-wrap pt-4">
            {remainingParties.map((party) => (
              <PartyLinkPill
                country={country}
                key={party[PartyField.Id]}
                party={party}
                locale={locale}
                sum={formatSum(party)}
              />
            ))}
          </ul>
        </details>
      )}
    </>
  );
};
