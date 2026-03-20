import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    "Ainārs Šlesers": {
      wiki: 21986592,
    },
    "Linda Liepiņa": {
      wiki: 70677636,
    },
    "Aivars Lembergs": {
      wiki: 33166111,
    },
    "Tatjana Ždanoka": {
      wiki: 1484751,
    },
    "Artis Pabriks": {
      wiki: 846920,
    },
    "Mārtiņš Staķis": {
      wiki: 65478820,
    },
    "Sandra Kalniete": {
      wiki: 672206,
    },
    "Roberts Zīle": {
      wiki: 1484744,
    },
    "Uldis Sesks": {
      wiki: 14144503,
    },
    "Arkādijs Suharenko": {
      wiki: 77101213,
    },
    "LEONIDS ESTERKINS": {
      wiki: 77191867,
    },
    "Ivars Ijabs": {
      wiki: 61387408,
    },
  },

  relations: [
    [
      ["NORMUNDS BERGS", RelationKind.family],
      ["Jānis Bergs", RelationKind.family],
    ],
    [
      ["Mārtiņš Staķis", RelationKind.family],
      ["Ilze Paidere-Staķe", RelationKind.family],
    ],

    [
      ["Olafs Berķis", RelationKind.family],
      ["Jānis Berķis", RelationKind.family],
      ["Nauris Berķis", RelationKind.family],
    ],
  ],
};
