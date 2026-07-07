import type { PropsWithChildren, ReactNode } from "react";

import { ChevronDownIcon, SquareMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export interface FilterChecklistSectionProps<T> {
  title: string;
  items: T[];
  activeItems: ReadonlySet<T>;
  onToggleItem: (item: T) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  renderItem: (item: T) => {
    key: string;
    label: React.ReactNode;
  };
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const FilterChecklistSection = <T,>({
  title,
  items,
  activeItems,
  onToggleItem,
  onSelectAll,
  onSelectNone,
  renderItem,
  isOpen,
  onToggleOpen,
}: FilterChecklistSectionProps<T>) => {
  if (items.length <= 1) return null;

  return (
    <FilterSheetSection
      title={title}
      badge={
        <FilterSheetSectionCounter
          value={activeItems.size}
          max={items.length}
        />
      }
      isOpen={isOpen}
      onToggle={onToggleOpen}
    >
      <div className="max-h-72 overflow-x-hidden overflow-y-auto pr-2">
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const { key, label } = renderItem(item);
            const isChecked = activeItems.has(item);

            return (
              <label
                className="flex cursor-pointer items-center gap-2"
                key={key}
              >
                <Checkbox
                  className="shrink-0 after:inset-0"
                  checked={isChecked}
                  onCheckedChange={() => onToggleItem(item)}
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>
      <FilterSheetSectionFooterButtons
        selectAllDisabled={activeItems.size === items.length}
        selectAll={onSelectAll}
        selectNoneDisabled={activeItems.size === 0}
        selectNone={onSelectNone}
      />
    </FilterSheetSection>
  );
};
