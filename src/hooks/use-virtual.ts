import { useVirtualizer } from "@tanstack/react-virtual";

// This has to be used until react compiler in tanstack virtual is fixed
// see https://github.com/TanStack/virtual/issues/736
export const useVirtual = (options: Parameters<typeof useVirtualizer>[0]) => {
  "use no memo";

  return { ...useVirtualizer(options) };
};
