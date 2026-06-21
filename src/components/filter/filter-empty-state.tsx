"use client";

import { FileQuestionMark, FunnelX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClientTranslations } from "@/hooks/use-client-translations";

interface FilterEmptyStateProps {
  onReset: () => void;
}

export const FilterEmptyState = ({ onReset }: FilterEmptyStateProps) => {
  const t = useClientTranslations("filter");

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <FileQuestionMark className="text-muted-foreground size-8" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        {t("empty.title")}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {t("empty.p0")}
      </p>
      <Button onClick={onReset} variant="outline" className="mt-6">
        <FunnelX className="mr-2 size-4" />
        {t("empty.reset")}
      </Button>
    </div>
  );
};
