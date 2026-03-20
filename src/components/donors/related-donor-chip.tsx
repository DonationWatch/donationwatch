"use client";

import type { JSX } from "react";

import { BriefcaseBusiness, Building2, Landmark } from "lucide-react";

import type { CountryConfig } from "@/utils/countries";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";

import { DonorLink } from "@/components/donors/donor-link";
import { Family } from "@/components/icons/Family";
import { formatCompactCountryCurrency } from "@/utils/formatter";
import { sumPartySums } from "@/utils/math";
import { RelationKind } from "@/utils/types";

const kindIcons: Record<RelationKind, JSX.Element> = {
  [RelationKind.family]: <Family size={16} />,
  [RelationKind.company]: <Building2 size={16} />,
  [RelationKind.owner]: <BriefcaseBusiness size={16} />,
  [RelationKind.organization]: <Landmark size={16} />,
};

export const RelatedDonorChip = ({
  name,
  kind,
  locale,
  country,
  sums,
}: {
  name: string;
  kind: RelationKind;
  locale: ConstLocale;
  country: CountryConfig;
  sums?: PartyYearsSums;
}) => {
  const sum = sumPartySums(sums ?? {});

  return (
    <DonorLink
      donor={name}
      country={country}
      className={
        "flex items-center space-x-1 rounded-full border px-2 py-1 text-sm font-normal"
      }
    >
      <div className="rounded-full p-0.5">{kindIcons[kind]}</div>
      <span>{name}</span>
      {sums ? (
        <span className="bg-primary/10 ml-2 rounded-full px-1.5 py-0.5 text-xs">
          {formatCompactCountryCurrency(locale, sum, country)}
        </span>
      ) : null}
    </DonorLink>
  );
};
