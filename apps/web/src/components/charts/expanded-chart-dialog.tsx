"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@donationwatch/ui/components/dialog";

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
        className="flex h-full max-h-[90vh] w-full flex-col overflow-hidden p-0 lg:max-w-[90vw]"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 grow flex-col overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
