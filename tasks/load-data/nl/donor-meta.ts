import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    "Atlantische Commissie": {
      wiki: 41602220,
    },
    "S. Beckerman": {
      wiki: 70385201,
    },
    "K. van Sparrentak": {
      wiki: 62421416,
    },
    "B. Eickhout": {
      wiki: 23257753,
    },
    "T. Strik": {
      wiki: 18312702,
    },
    "M. van Nispen": {
      wiki: 42547284,
    },
    "B. van Kent": {
      wiki: 75275966,
    },
    "L. Marijnissen": {
      wiki: 56106493,
    },
  },
  relations: [
    [
      ["ChristenUnie", RelationKind.company],
      ["Bestuurdersvereniging ChristenUnie", RelationKind.company],
    ],

    // Constar
    [
      ["Constar B.V.", RelationKind.company],
      ["Constar Beheer B.V.", RelationKind.company],
    ],
  ],
};
