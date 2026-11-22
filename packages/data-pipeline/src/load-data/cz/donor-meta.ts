import type { DonorMetaDefinition } from "@donationwatch/core/utils/types";

import { RelationKind } from "@donationwatch/core/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {},
  relations: [
    [
      ["Boris Šťastný", RelationKind.owner],
      ["Medical Investments a.s", RelationKind.company],
    ],
  ],
};
