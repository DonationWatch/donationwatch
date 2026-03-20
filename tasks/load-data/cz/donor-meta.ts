import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {},
  relations: [
    [
      ["Boris Šťastný", RelationKind.owner],
      ["Medical Investments a.s", RelationKind.company],
    ],
  ],
};
