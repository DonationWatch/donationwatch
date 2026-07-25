import type { ReceiverId } from "@/utils/types";

import { usePartiesMap } from "@/components/providers/country-provider";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";

export const PartyDot = ({
  party,
  nameClassName,
  className = "",
}: {
  party: ReceiverId;
  className?: string;
  nameClassName?: string;
}) => {
  const partiesMap = usePartiesMap();

  return (
    <span className={cn("flex items-center font-medium", className)}>
      <span
        className={`mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600`}
        style={{ backgroundColor: partiesMap[party][PartyField.Color] }}
      ></span>
      <span className={cn(nameClassName)}>
        {partiesMap[party][PartyField.Short]}
      </span>
    </span>
  );
};
