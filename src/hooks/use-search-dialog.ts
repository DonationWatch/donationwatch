import { useContext } from "react";

import { SearchDialogContext } from "@/app/providers";

export const useSearchDialog = () => {
  const ctx = useContext(SearchDialogContext);
  if (!ctx)
    throw new Error("useSearchDialog must be used within SearchDialogProvider");
  return ctx;
};
