"use client";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonorName } from "@/utils/donor";

export const DonorName = ({ donor }: { donor: string }) => {
  const t = useTranslations("common");

  return getDonorName(donor, t);
};
