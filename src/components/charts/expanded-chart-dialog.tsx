"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ExpandedChartDialog = ({
  isExpanded,
  setIsExpanded,
  title,
  children,
}: {
  isExpanded: boolean;
  setIsExpanded: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}) => {
  return (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <DialogContent
        className="h-full max-h-[90vh] w-full p-0 lg:max-w-[90vw]"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex grow flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
