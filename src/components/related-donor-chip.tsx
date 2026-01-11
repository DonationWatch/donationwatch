"use client";

import { BriefcaseBusiness, Building2 } from "lucide-react";

import { DonorLink } from "./donor-link";
import { RelationKind } from "../utils/types";
import { Family } from "./icons/Family";
import { formatCompactCountryCurrency } from "../utils/formatter";
import { sumPartySums } from "../utils/math";

import type { CountryConfig } from "../utils/countries";
import type { PartyYearsSums } from "../utils/loader/party-years-sums";
import type { ConstLocale } from "../utils/locales";
import type { FC, JSX } from "react";

const kindIcons: Record<RelationKind, JSX.Element> = {
  [RelationKind.family]: <Family size={16} />,
  [RelationKind.company]: <Building2 size={16} />,
  [RelationKind.owner]: <BriefcaseBusiness size={16} />,
};

export const RelatedDonorChip: FC<{
  name: string;
  kind: RelationKind;
  locale: ConstLocale;
  country: CountryConfig;
  sums?: PartyYearsSums;
}> = ({ name, kind, locale, country, sums }) => {
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
