import { cn } from "../utils/classname";
import { partyColor } from "../utils/color";
import { formatPartyShortName } from "../utils/formatter";

import type { CountryConfig } from "../utils/countries";
import type { ReceiverId } from "../utils/types";

export const PartyDot = ({
  party,
  country,
  nameClassName,
  className = "",
}: {
  party: ReceiverId;
  className?: string;
  nameClassName?: string;
  country: CountryConfig;
}) => {
  return (
    <span className={cn("flex items-center font-medium", className)}>
      <span
        className={`mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600`}
        style={{ backgroundColor: partyColor(party, country) }}
      ></span>
      <span className={cn(nameClassName)}>
        {formatPartyShortName(country, party)}
      </span>
    </span>
  );
};
