"use client";

import type { JSX } from "react";

import { BriefcaseBusiness, Building2, Landmark } from "lucide-react";

import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { DonorLink } from "@/components/donors/donor-link";
import { Family } from "@/components/icons/Family";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
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
  sums,
}: {
  name: string;
  kind: RelationKind;
  sums?: PartyYearsSums;
}) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();
  const sum = sumPartySums(sums ?? {});

  return (
    <DonorLink
      donor={name}
      className={
        "flex items-center space-x-1 rounded-full border px-2 py-1 text-sm font-normal"
      }
    >
      <div className="rounded-full p-0.5">{kindIcons[kind]}</div>
      <span>{name}</span>
      {sums ? (
        <span className="bg-primary/10 ml-2 rounded-full px-1.5 py-0.5 text-xs">
          {formatCompactCountryCurrency(browserBasedLocale, sum, country)}
        </span>
      ) : null}
    </DonorLink>
  );
};
