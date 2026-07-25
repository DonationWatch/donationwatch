"use client";

import { useLocale } from "next-intl";

import type { Donation, ReceiverId } from "@/utils/types";

import { FormatAnd } from "@/components/formatter";
import {
  ArticleSectionColumn,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { TextPartyLink } from "@/components/parties/text-party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { Translation } from "@/components/translation";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonorName } from "@/utils/donor";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { capitalize } from "@/utils/string";
import { DonationField, DonationType } from "@/utils/types";

import { DonorDonationTypesSankey } from "./donor-donation-types-sankey";

export const DonorDonationTypes = ({
  donations,
}: {
  donations: Donation[];
}) => {
  const countryConfig = useRequiredCountryConfig();
  const tCommon = useTranslations("common");
  const tDonor = useTranslations("donor");
  const tDonationType = useTranslations("donation_type");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  if (!donations || donations.length === 0) {
    return null;
  }

  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  const typeSum: Partial<Record<DonationType, number>> = {};
  const typePartySum: Partial<
    Record<DonationType, Record<ReceiverId, number>>
  > = {};
  let totalSum = 0;

  for (const donation of donations) {
    const receiver = donation[DonationField.Receiver];
    const type = donation[DonationField.DonationType] ?? DonationType.Money;
    const amount = donation[DonationField.Amount];

    totalSum += amount;

    typeSum[type] ??= 0;
    typeSum[type]! += amount;

    typePartySum[type] ??= {};
    typePartySum[type]![receiver] ??= 0;
    typePartySum[type]![receiver] += amount;
  }

  const types = Object.keys(typeSum).map(Number) as DonationType[];

  return (
    <ArticleSectionWrapper id={"sec-donor-donation-types"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-donation-types"}
            title={tDonor("donation_type.title")}
          />
          <p className="mb-4">
            {tDonor("donation_type.subtitle", {
              donor: donorName,
            })}
          </p>
          <p className="mb-4">
            <Translation
              t={tDonor}
              translationId={"donation_type.summary"}
              variables={{
                total: (
                  <FormatAnd
                    locale={locale}
                    items={types
                      .toSorted((a, b) => typeSum[b]! - typeSum[a]!)
                      .map((type) =>
                        tDonor("donation_type.summary_item", {
                          amount: formatCountryCurrency(
                            browserBasedLocale,
                            typeSum[type] ?? 0,
                            countryConfig,
                          ),
                          type: tDonationType(`${type}`),
                        }),
                      )}
                  />
                ),
              }}
            />
          </p>
          <ul className="mx-2 py-2 *:py-1">
            {types
              .toSorted((a, b) => typeSum[b]! - typeSum[a]!)
              .map((type) => {
                const sum = typeSum[type]!;
                const parties = typePartySum[type]!;
                return (
                  <li key={type} className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                      <span>{capitalize(tDonationType(`${type}`))}</span>
                      <span className="tabular-nums">
                        {formatCountryCurrency(
                          browserBasedLocale,
                          sum,
                          countryConfig,
                        )}{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          (
                          {formatPercentFormat(
                            browserBasedLocale,
                            sum / totalSum,
                          )}
                          )
                        </span>
                      </span>
                    </div>
                    <ul className="ml-4 space-y-0.5">
                      {Object.entries(parties)
                        .toSorted(([, a], [, b]) => b - a)
                        .map(([receiverId, partySum]) => (
                          <li
                            key={receiverId}
                            className="flex items-center justify-between text-sm"
                          >
                            <TextPartyLink
                              party={receiverId as ReceiverId}
                              locale={locale}
                            />
                            <span className="tabular-nums">
                              {formatCountryCurrency(
                                browserBasedLocale,
                                partySum,
                                countryConfig,
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </li>
                );
              })}
          </ul>
        </ArticleSectionColumn>
        <ArticleSectionColumn>
          <DonorDonationTypesSankey
            donations={donations}
            donorName={donorName}
          />
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};
