"use client";

import { useTranslations } from "next-intl";

import { getDonorName } from "@/utils/donor";

export const DonorName = ({ donor }: { donor: string }) => {
  const t = useTranslations("common");

  return getDonorName(donor, t);
};
