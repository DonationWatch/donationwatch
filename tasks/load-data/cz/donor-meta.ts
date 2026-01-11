import { RelationKind } from "../../../src/utils/types";

import type { DonorMetaDefinition } from "../../../src/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {},
  relations: [
    [
      ["Boris Šťastný", RelationKind.owner],
      ["Medical Investments a.s", RelationKind.company],
    ],
  ],
};
