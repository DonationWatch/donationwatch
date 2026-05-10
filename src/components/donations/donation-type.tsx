import type { DonationType } from "@/utils/types";

export const DonationTypeLabel = ({
  label,
}: {
  label: string;
  donationType: DonationType;
}) => {
  return <div className={"text-sm first-letter:uppercase"}>{label}</div>;
};
