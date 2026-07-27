import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    "MARTIN PAUL MOSHAL": {
      wiki: 78629605,
    },
    "NICHOLAS FRANK OPPENHEIMER": {
      wiki: 1296094,
    },
    "JONATHAN ERNEST MAXIMILLIAN OPPENHEIMER": {
      wiki: 44457010,
    },
    "MARY SLACK": {
      wiki: 78649170,
    },
    "KONRAD ADENAUER STIFTUNG NPC": {
      wiki: 2356400,
    },
    "HARMONY GOLD MINING COMPANY LTD": {
      wiki: 2777604,
    },
    "AFRICAN RAINBOW MINERALS LTD": {
      wiki: 28814308,
    },
  },
  relations: [
    [
      ["FYNBOS EKWITEIT PTY LTD", RelationKind.company],
      ["FYNBOS KAPITAAL PTY LTD", RelationKind.company],
      ["FYNBOS TRUST", RelationKind.company],
    ],

    // Oppenheimer family
    [
      ["NICHOLAS FRANK OPPENHEIMER", RelationKind.family],
      ["JONATHAN ERNEST MAXIMILLIAN OPPENHEIMER", RelationKind.family],
      ["REBECCA OPPENHEIMER", RelationKind.family],
      ["MARY SLACK", RelationKind.family],
      ["JESSICA SLACK-JELL", RelationKind.family],
    ],
  ],
};
