"use client";

import { RankBadge } from "@/components/donations/ranking-item";
import {
  ArticleSectionColumn,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { PercentageHint } from "@/components/percentage-hint";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { formatCountryCurrency } from "@/utils/formatter";

import type { PartyViaSummary } from "./original-receivers/types";

import { PartyViaTreemap } from "./original-receivers/party-via-treemap";

interface PartyOriginalReceiversProps {
  summary: PartyViaSummary;
}

export const PartyOriginalReceivers = ({
  summary,
}: PartyOriginalReceiversProps) => {
  const countryConfig = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();
  const tCommittees = useTranslations("party.committees");

  if (!summary.hasViaData) return null;

  const { party, viaSum, committeeCount, items } = summary;
  const partyName = party[PartyField.Short];
  const topVehicles = items.slice(0, 5);

  const formattedAmount = formatCountryCurrency(
    browserBasedLocale,
    viaSum,
    countryConfig,
  );

  return (
    <ArticleSectionWrapper id="sec-party-via-committees">
      <ArticleSectionTwoColumns>
        {/* Left Column: Narrative & Top 5 Ranked */}
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id="sec-party-via-committees"
            title={tCommittees("title")}
          />

          <p className="mb-4">
            {tCommittees("p0", {
              party: partyName,
              count: committeeCount,
              amount: formattedAmount,
            })}
          </p>

          <p>{tCommittees("top_intro")}</p>

          <ul className="mx-2 py-2 *:py-1">
            {topVehicles.map((v, idx) => (
              <li
                key={v.name}
                className="flex w-full items-center justify-between text-sm font-semibold"
              >
                <div className="flex items-center overflow-x-hidden">
                  <RankBadge rank={idx + 1} />
                  <span className="truncate">{v.name}</span>
                </div>
                <div className="ml-2 flex tabular-nums">
                  <span className="lg:mr-1">
                    {formatCountryCurrency(
                      browserBasedLocale,
                      v.sum,
                      countryConfig,
                    )}
                  </span>
                  <PercentageHint
                    browserBasedLocale={browserBasedLocale}
                    percentage={v.pctOfParty}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ArticleSectionColumn>

        {/* Right Column: Treemap Visualization */}
        <ArticleSectionColumn>
          <div>
            <PartyViaTreemap
              party={party}
              items={items}
              title={tCommittees("treemap.title", { party: partyName })}
              subtitle={tCommittees("treemap.subtitle")}
              height={600}
            />
          </div>
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};
