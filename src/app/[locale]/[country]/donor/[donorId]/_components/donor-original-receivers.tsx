"use client";

import { useLocale } from "next-intl";

import type { ConstLocale } from "@/utils/locales";
import type { Donation } from "@/utils/types";

import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { TextPartyLink } from "@/components/parties/text-party-link";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { Translation } from "@/components/translation";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import {
  formatAnd,
  formatCountryCurrency,
  formatPercentFormat,
} from "@/utils/formatter";

import { DonorViaTable } from "./original-receivers/donor-via-table";
import { useViaSummary } from "./original-receivers/use-via-summary";

export const DonorOriginalReceivers = ({
  donations,
}: {
  donations: Donation[];
}) => {
  const summary = useViaSummary(donations);
  const countryConfig = useRequiredCountryConfig();
  const partiesMap = usePartiesMap();
  const tDonor = useTranslations("donor");
  const locale = useLocale() as ConstLocale;
  const browserBasedLocale = useBrowserBasedLocale();

  // If this donor (or country) has no routed donations, cleanly return null
  if (summary.donationsWithVia.length === 0) {
    return null;
  }

  const {
    donorName,
    totalDonorSum,
    totalViaSum,
    directSum,
    pctOfDonorTotal,
    viaList,
    partyDistribution,
    earliestYear,
    latestYear,
  } = summary;

  return (
    <ArticleSectionWrapper id="sec-donor-via-table">
      <ArticleSectionTitle
        id="sec-donor-via-table"
        title={tDonor("via.title")}
      />

      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          {/* Introductory SEO narrative */}
          <p className="mb-4 leading-relaxed">
            {tDonor("via.overview", {
              viaSum: formatCountryCurrency(
                browserBasedLocale,
                totalViaSum,
                countryConfig,
              ),
              donor: donorName,
              pct: formatPercentFormat(browserBasedLocale, pctOfDonorTotal),
              donorSum: formatCountryCurrency(
                browserBasedLocale,
                totalDonorSum,
                countryConfig,
              ),
            })}
            {directSum > 0 ? (
              <>
                {" "}
                {tDonor("via.direct_donations", {
                  amount: formatCountryCurrency(
                    browserBasedLocale,
                    directSum,
                    countryConfig,
                  ),
                })}
              </>
            ) : null}
          </p>

          {/* Downstream Political Alignment (integrated above the table) */}
          <p className="mb-4 leading-relaxed">
            {tDonor("via.downstream_overview", {
              count: partyDistribution.length,
            })}{" "}
            {partyDistribution[0] ? (
              <Translation
                t={tDonor}
                translationId={"via.downstream_primary"}
                variables={{
                  party: (
                    <TextPartyLink
                      party={partyDistribution[0].party}
                      locale={locale}
                    />
                  ),
                  amount: formatCountryCurrency(
                    browserBasedLocale,
                    partyDistribution[0].sum,
                    countryConfig,
                  ),
                  pct: formatPercentFormat(
                    browserBasedLocale,
                    partyDistribution[0].pct,
                  ),
                }}
              />
            ) : null}
            {partyDistribution.length > 1 ? (
              <>
                {" "}
                <Translation
                  t={tDonor}
                  translationId={"via.downstream_followed_by"}
                  variables={{
                    list: formatAnd(
                      browserBasedLocale,
                      partyDistribution.slice(1).map((p) =>
                        tDonor("via.downstream_item", {
                          party:
                            partiesMap[p.party]?.[PartyField.Name] ?? p.party,
                          amount: formatCountryCurrency(
                            browserBasedLocale,
                            p.sum,
                            countryConfig,
                          ),
                          pct: formatPercentFormat(browserBasedLocale, p.pct),
                        }),
                      ),
                    ),
                  }}
                />
              </>
            ) : null}
          </p>

          <p className="mb-6 leading-relaxed">
            {tDonor("via.table_intro", {
              years: earliestYear
                ? tDonor("via.table_intro_years", {
                    earliestYear,
                    latestYear,
                  })
                : "",
            })}
          </p>

          {/* TanStack-powered Conduit Table */}
          <DonorViaTable
            viaList={viaList}
            countryConfig={countryConfig}
            locale={locale}
            browserBasedLocale={browserBasedLocale}
          />
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};
