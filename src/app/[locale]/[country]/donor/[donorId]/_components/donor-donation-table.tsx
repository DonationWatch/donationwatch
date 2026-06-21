"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Donation } from "@/utils/types";

import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

export const DonorDonationTable = ({
  donations,
  countryConfig,
}: {
  countryConfig: CountryConfig;
  donations: Donation[];
}) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");

  if (!donations || donations.length === 0) {
    return null;
  }

  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  return (
    <ArticleSectionWrapper id={"sec-donor-donations-table"}>
      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-donations-table"}
            title={t("changes.title")}
          />

          <p className="mb-6">
            {t("donor.table", {
              donor: donorName,
            })}
          </p>

          <DonationHistoryTable
            readonlyDonor={true}
            donations={donations}
            country={countryConfig}
            years={countryConfig.years}
            partiesIds={[]}
          />
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};
