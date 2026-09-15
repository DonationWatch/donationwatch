import { getTranslations } from "next-intl/server";
import Link from "next/link";

import type {
  GlobalBiggestDonation,
  GlobalBiggestDonor,
} from "@/utils/loader/global-biggest-donations";
import type { ConstLocale } from "@/utils/locales";

import { ConvertedCurrency } from "@/components/donations/converted-currency";
import { RankBadge } from "@/components/donations/rank-badge";
import { ArticleSection } from "@/components/layout/article";
import { Card } from "@/components/ui/card";
import { getPartySync } from "@/config/parties";
import { PartyField } from "@/types/party";
import { COUNTRY_CONFIG, getCountryName } from "@/utils/countries";
import { countryFlags } from "@/utils/country-flags";
import { CURRENCY_RATES_DATE, getCurrencyRatesSummary } from "@/utils/currency";

export const GlobalBiggestDonations = async ({
  donations,
  donors,
  locale,
}: {
  donations: GlobalBiggestDonation[];
  donors: GlobalBiggestDonor[];
  locale: ConstLocale;
}) => {
  const [tRoot, tCountries] = await Promise.all([
    getTranslations({ locale, namespace: "root" }),
    getTranslations({ locale, namespace: "countries" }),
  ]);

  if (!donations.length && !donors.length) return null;

  const ratesSummary = getCurrencyRatesSummary(
    tRoot("biggest_donations.rates_as_of", { date: CURRENCY_RATES_DATE }),
  );

  return (
    <ArticleSection
      title={tRoot("biggest_donations.title")}
      id="sec-global-biggest-donations"
    >
      <p className="text-gray-700 dark:text-gray-300">
        {tRoot("biggest_donations.text")}
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card 1: Largest single donations */}
        <Card
          id="sec-global-single-donations"
          padding="sm"
          className="flex flex-col justify-between space-y-3"
        >
          <div>
            <h3 className="border-b border-zinc-100 pb-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
              {tRoot("biggest_donations.single_donations_title")}
            </h3>

            <ol className="mt-2 max-h-[380px] list-none divide-y divide-zinc-100 overflow-y-auto p-0 pr-1 dark:divide-zinc-800/60">
              {donations.slice(0, 10).map((item, idx) => {
                const party = getPartySync(item.country, item.party);
                const partyColor = party?.[PartyField.Color] ?? "#71717a";
                const partyShort = party?.[PartyField.Short] ?? item.party;
                const countryName = getCountryName(
                  COUNTRY_CONFIG[item.country],
                  tCountries,
                );

                return (
                  <li
                    key={`${item.country}-${item.id}`}
                    className="flex items-center gap-2.5 py-2"
                  >
                    <RankBadge rank={idx + 1} className="mr-0 shrink-0" />
                    <div className="flex min-w-0 grow flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          prefetch={false}
                          href={`/${locale}/${item.country}/donor/${item.donorId}`}
                          className="hover:text-primary-700 dark:hover:text-primary-400 min-w-0 truncate text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                          title={item.donor}
                        >
                          {item.donor}
                        </Link>
                        <div className="shrink-0 text-right text-sm font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
                          <ConvertedCurrency
                            valueInEur={item.amountInEur}
                            originalValue={item.amount}
                            originalCurrency={item.currency}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-sm">
                        <Link
                          prefetch={false}
                          href={`/${locale}/${item.country}/party/${item.party}/donors`}
                          className="inline-flex min-w-0 items-center gap-1 truncate font-medium hover:underline"
                        >
                          <span
                            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: partyColor }}
                          />
                          <span className="truncate">{partyShort}</span>
                        </Link>
                        <Link
                          prefetch={false}
                          href={`/${locale}/${item.country}`}
                          className="inline-flex shrink-0 items-center gap-1.5 hover:underline"
                        >
                          <span className="flex h-3.5 w-5 shrink-0 items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              aria-hidden="true"
                              className="rounded-2xs max-h-full max-w-full object-contain"
                              src={countryFlags[item.country]}
                              alt=""
                            />
                          </span>
                          <span>{countryName}</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <footer className="border-t border-zinc-100 pt-2 text-center text-sm leading-tight dark:border-zinc-800">
            {tRoot("biggest_donations.single_donations_footer")} •{" "}
            <span
              title={ratesSummary}
              className="cursor-help underline decoration-dotted underline-offset-2 hover:underline"
            >
              {tRoot("biggest_donations.converted_to_eur")}
            </span>
          </footer>
        </Card>

        {/* Card 2: Largest cumulative donors */}
        <Card
          id="sec-global-top-donors"
          padding="sm"
          className="flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="border-b border-zinc-100 pb-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
              {tRoot("biggest_donations.top_donors_title")}
            </div>

            <div className="mt-2 max-h-[380px] divide-y divide-zinc-100 overflow-y-auto pr-1 dark:divide-zinc-800/60">
              {donors.slice(0, 10).map((donor, idx) => {
                const countryName = getCountryName(
                  COUNTRY_CONFIG[donor.country],
                  tCountries,
                );

                return (
                  <div
                    key={`${donor.country}-${donor.donorId}`}
                    className="flex items-center gap-2.5 py-2"
                  >
                    <RankBadge rank={idx + 1} className="mr-0 shrink-0" />
                    <div className="flex min-w-0 grow flex-col">
                      <Link
                        prefetch={false}
                        href={`/${locale}/${donor.country}/donor/${donor.donorId}`}
                        className="hover:text-primary-700 dark:hover:text-primary-400 min-w-0 truncate text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                        title={donor.donor}
                      >
                        {donor.donor}
                      </Link>
                      <div className="flex min-w-0 items-center gap-1.5 text-sm">
                        <span className="flex h-3.5 w-5 shrink-0 items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            aria-hidden="true"
                            className="rounded-2xs max-h-full max-w-full object-contain"
                            src={countryFlags[donor.country]}
                            alt=""
                          />
                        </span>
                        <Link
                          prefetch={false}
                          href={`/${locale}/${donor.country}`}
                          className="min-w-0 truncate hover:underline"
                        >
                          {countryName}
                        </Link>
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-sm font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
                      <ConvertedCurrency
                        valueInEur={donor.sumInEur}
                        originalValue={donor.sum}
                        originalCurrency={donor.currency}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-2 text-center text-sm leading-tight dark:border-zinc-800">
            {tRoot("biggest_donations.top_donors_footer")} •{" "}
            <span
              title={ratesSummary}
              className="cursor-help underline decoration-dotted underline-offset-2 hover:underline"
            >
              {tRoot("biggest_donations.converted_to_eur")}
            </span>
          </div>
        </Card>
      </div>
    </ArticleSection>
  );
};
