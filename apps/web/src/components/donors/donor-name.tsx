"use client";

import { getDonorName } from "@donationwatch/core/utils/donor";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const DonorName = ({ donor }: { donor: string }) => {
  const t = useTranslations("common");

  return getDonorName(donor, t);
};
