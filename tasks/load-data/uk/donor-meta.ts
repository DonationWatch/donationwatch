import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    "Unite the Union": {
      wiki: 38443462,
    },
    UNISON: {
      wiki: 232324,
    },
    GMB: {
      wiki: 359289,
    },
    "Union of Shop, Distributive and Allied Workers (USDAW)": {
      wiki: 613980,
    },
    "Lord David Sainsbury": {
      wiki: 417537,
    },
    "THE PHOENIX PARTNERSHIP (LEEDS) LTD": {
      wiki: 41409525,
    },
    "Lord John Sainsbury": {
      wiki: 417553,
    },
    "The Electoral Commission": {
      wiki: 615925,
    },
    "Christopher Harborne": {
      wiki: 62588649,
    },
    "The Co-operative Group Ltd": {
      wiki: 1434174,
    },
    "Communication Workers Union": {
      wiki: 359303,
    },
    "House of Lords": {
      wiki: 13658,
    },
    "Jeremy J Hosking": {
      wiki: 30429114,
    },
    "Sir Michael L Davis": {
      wiki: 37495192,
    },
    "Mohamed Younes Mansour Lotfy Mansour": {
      wiki: 39025164,
    },
    "Lord Michael S Farmer": {
      wiki: 43539744,
    },
    "Francis X Hester": {
      wiki: 74866190,
    },
    "Gary Lubner": {
      wiki: 77773146,
    },
    "Access Industries (UK) Ltd": {
      wiki: 12186358,
    },
    "Charlie Mullins": {
      wiki: 56412898,
    },
    "Archibald Boyd Tunnock": {
      wiki: 60987722,
    },
    "Muhammad Ziauddin Yusuf": {
      wiki: 77335210,
    },
    "Jeremy Elliott San": {
      wiki: 1105200,
    },
    "Holy VUKADINOVIC": {
      wiki: 152915,
    },
    "Stephen J Fitzpatrick": {
      wiki: 45590055,
    },
    "Anna Lisbet Kristina Rausing": {
      wiki: 22035525,
    },
    "Hans Anders Rausing": {
      wiki: 882428,
    },
    "Kirsten Rausing": {
      wiki: 22643624,
    },
    "Peter Rigby": {
      wiki: 8329913,
    },
    "Laurence Stephen Geller": {
      wiki: 50510078,
    },
    "Maggi Hambling": {
      wiki: 1194521,
    },
    "Rigby Group PLC": {
      wiki: 40888897,
    },
    "Peter J Wood": {
      wiki: 20074999,
    },
    "M & C Saatchi PLC": {
      wiki: 1995466,
    },
    "Saatchi and Saatchi Group Ltd": {
      wiki: 350211,
    },
    "Ghanem Mohammed Zaki Nuseibeh": {
      wiki: 31349241,
    },
    "Andrew E Law": {
      wiki: 45322473,
    },
    "Peter Andrew Cruddas": {
      wiki: 35208651,
    },
    "Association of Conservative Clubs": {
      wiki: 4391234,
    },
    "Lord David Alliance": {
      wiki: 1593491,
    },
    "Sir Timothy Sainsbury": {
      wiki: 417704,
    },
    "Sir David Garrard": {
      wiki: 4447953,
    },
    "Andrew Rosenfeld": {
      wiki: 4468078,
    },
    "Associated Society of Locomotive Engineers and Firemen (ASLEF)": {
      wiki: 402739,
    },
    "Bakers, Food and Allied Workers' Union (BFAWU)": {
      wiki: 451997,
    },
    "Broadcasting, Entertainment, Cinematograph and Theatre Union (BECTU)": {
      wiki: 627075,
    },
    "Communication Workers Union (CWU)": {
      wiki: 359303,
    },
    "Community (trade union)": {
      wiki: 3699576,
    },
    "Fire Brigades Union (FBU)": {
      wiki: 452020,
    },
    "Musicians' Union (MU)": {
      wiki: 1697671,
    },
    "National Union of Mineworkers (NUM)": {
      wiki: 415162,
    },
    "Professional Footballers' Association (PFA)": {
      wiki: 413073,
    },
    "National Union of Rail, Maritime and Transport Workers (RMT)": {
      wiki: 465985,
    },
    "Transport Salaried Staffs' Association (TSSA)": {
      wiki: 187321,
    },
    "Union of Construction, Allied Trades and Technicians (UCATT)": {
      wiki: 3713524,
    },
    "Nicholas A C Candy": {
      wiki: 4155895,
    },
    "Ecotricity Ltd": {
      wiki: 6014283,
    },
    "PricewaterhouseCoopers Ltd (PwC)": {
      wiki: 148172,
    },
    "Labour Together Ltd": {
      wiki: 75734943,
    },
    "Deloitte LLP": {
      wiki: 586015,
    },
    "Zac FR Goldsmith": {
      wiki: 3665467,
    },
    "Annabel Goldsmith": {
      wiki: 942926,
    },
    "Benjamin J Goldsmith": {
      wiki: 3745234,
    },
    "Joseph C E Bamford": {
      wiki: 69642622,
    },
    "Lord Anthony P Bamford": {
      wiki: 16181144,
    },
    "JC Bamford Excavators Ltd": {
      wiki: 1007853,
    },
    "Yan Huo": {
      wiki: 34964947,
    },
    "Fiona Cottrell": {
      wiki: 57548655,
    },
    "Sir John Vincent Cable": {
      wiki: 414916,
    },
    "Arron Banks": {
      wiki: 44002461,
    },
    "Joseph Rowntree Reform Trust Ltd": {
      wiki: 982333,
    },
    "Gordon Stewart Gibb": {
      wiki: 15676758,
    },
    "Flamingo Land": {
      wiki: 1431576,
    },
    "LOCAL GOVERNMENT ASSOCIATION": {
      wiki: 3615272,
    },
    // Note: this is the wiki article of her husband.
    // For now we don't support relations that aren't donors.
    // This should be improved in the future, maybe even with additional tokens of [chairman, Daily Mail and General Trust, wiki: 714373]
    "Claudia Caroline Harmsworth, Viscountess Rothermere": {
      wiki: 1292344,
    },
    "Greybull Capital LLP": {
      wiki: 50215801,
    },
    "Legatum Ltd": {
      wiki: 11829425,
    },
    "Benyamin Naeem Habib": {
      wiki: 60876519,
    },
  },
  relations: [
    // Flamingo Land
    [
      ["Gordon Stewart Gibb", RelationKind.owner],
      ["Flamingo Land", RelationKind.company],
    ],

    // Bamford family
    [
      ["Joseph C E Bamford", RelationKind.family],
      ["Lord Anthony P Bamford", RelationKind.family],
      ["Mark J C Bamford", RelationKind.family],
    ],
    // JCB
    [
      ["Lord Anthony P Bamford", RelationKind.owner],
      ["JC Bamford Excavators Ltd", RelationKind.company],
    ],
    [
      ["M & C Saatchi PLC", RelationKind.company],
      ["Saatchi and Saatchi Group Ltd", RelationKind.company],
    ],
    [
      ["Stephen J Fitzpatrick", RelationKind.owner],
      ["Imagination Industries Incubator Ltd", RelationKind.company],
    ],
    [
      ["Anna Lisbet Kristina Rausing", RelationKind.family],
      ["Hans Anders Rausing", RelationKind.family],
      ["Marit M Rausing", RelationKind.family],
      ["Sigrid Rausing", RelationKind.family],
      ["Kirsten Rausing", RelationKind.family],
    ],
    [
      ["Peter Rigby", RelationKind.owner],
      ["Rigby Group PLC", RelationKind.company],
    ],
    [
      ["Laurence Stephen Geller", RelationKind.owner],
      ["GELLER CAPITAL PARTNERS LLP", RelationKind.company],
    ],

    [
      ["Bansols Beta Ltd", RelationKind.company],
      ["MSG Sandhurst Ltd", RelationKind.company],
      ["MSG Commercial Ltd", RelationKind.company],
      ["Moonpal S Grewal", RelationKind.owner],
    ],

    // Terence Charles Mordaunt
    [
      ["First Corporate Shipping Ltd", RelationKind.company],
      ["First Corporate Consultants Ltd", RelationKind.company],
    ],

    // Richard TICE
    [
      ["Tisun Investments Ltd", RelationKind.company],
      ["Leave Means Leave Ltd", RelationKind.company],
      ["Sunley Holdings Ltd", RelationKind.company],
      ["Britain Means Business Ltd", RelationKind.company],
    ],

    // Sainsbury
    [
      ["Lord David Sainsbury", RelationKind.family],
      ["Lord John Sainsbury", RelationKind.family],
      ["Sir Timothy Sainsbury", RelationKind.family],
    ],

    // Minerva PLC
    [
      ["Andrew Rosenfeld", RelationKind.owner],
      ["Sir David Garrard", RelationKind.owner],
    ],

    // lottery winners Christine and Colin Weir
    [
      ["Christine Weir", RelationKind.family],
      ["Colin Weir", RelationKind.family],
      ["Cor Unum", RelationKind.company],
    ],

    // https://martinplaut.com/2025/03/28/major-donor-to-reform-u-k-party-sold-weapons-parts-to-russian-supplier/
    [
      ["H.R. Smith Group Ltd", RelationKind.company],
      ["Techtest Ltd", RelationKind.company],
    ],

    // https://en.wikipedia.org/wiki/Goldschmidt_family
    [
      ["Zac FR Goldsmith", RelationKind.family],
      ["Annabel Goldsmith", RelationKind.family],
      ["Benjamin J Goldsmith", RelationKind.family],
    ],

    [
      ["Dale Vince", RelationKind.owner],
      ["Ecotricity Ltd", RelationKind.company],
    ],

    [
      ["HEATHROW AIRPORT HOLDINGS Ltd", RelationKind.company],
      ["Heathrow Airport Ltd", RelationKind.company],
    ],

    [
      ["LOCAL GOVERNMENT ASSOCIATION", RelationKind.organization],
      ["Local Government Association Labour Group", RelationKind.organization],
    ],

    // Westcombe Group
    [
      ["WESTCOMBE DEVELOPMENTS Ltd", RelationKind.company],
      ["WESTCOMBE HOMES Ltd", RelationKind.organization],
      ["Kamal Pankhania", RelationKind.owner],
      ["Vraj Pankhania", RelationKind.owner],
    ],

    // Legatum
    [
      ["Legatum Ltd", RelationKind.company],
      ["Benyamin Naeem Habib", RelationKind.owner],
    ],
  ],
};
