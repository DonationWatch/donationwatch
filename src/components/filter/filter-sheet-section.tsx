import type { PropsWithChildren, ReactNode } from "react";

import { ChevronDownIcon, SquareMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useClientTranslations } from "@/hooks/use-client-translations";

export interface FilterSheetSectionProps {
  title: string;
  badge?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterSheetSectionCounter = ({
  value,
  max,
}: {
  value: number;
  max: number;
}) => {
  if (value >= max) return;

  return (
    <span className="ml-1 text-[10px] font-medium lowercase">
      ({value}/{max})
    </span>
  );
};

export const FilterSheetSectionFooterButtons = ({
  selectAllDisabled,
  selectNoneDisabled,
  selectAll,
  selectNone,
}: PropsWithChildren<{
  selectAllDisabled: boolean;
  selectAll: () => void;
  selectNoneDisabled: boolean;
  selectNone: () => void;
}>) => {
  const tFilter = useClientTranslations("filter");

  return (
    <div className="flex gap-2">
      <Button
        className="grow"
        variant={"outline"}
        disabled={selectAllDisabled}
        onClick={() => selectAll()}
      >
        {tFilter("select_all")}
      </Button>
      <Button
        className="shrink-0"
        variant={"ghost"}
        disabled={selectNoneDisabled}
        onClick={() => selectNone()}
        title={tFilter("select_none")}
      >
        <SquareMinus />
      </Button>
    </div>
  );
};

export const FilterSheetSection = ({
  title,
  badge,
  isOpen,
  onToggle,
  children,
}: PropsWithChildren<FilterSheetSectionProps>) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => onToggle()}
      className="data-open:bg-muted rounded-md"
    >
      <CollapsibleTrigger
        render={
          <Button variant="ghost" className="w-full">
            {title} {badge}
            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
          </Button>
        }
      />
      <CollapsibleContent>
        <div className="flex flex-col gap-2 p-2 text-sm">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
