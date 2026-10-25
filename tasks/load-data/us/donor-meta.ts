import type { DonorMetaDefinition } from "@/utils/types";

import { RelationKind } from "@/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    // Individual Megadonors
    "MUSK, ELON": { wiki: 909036 }, // Elon Musk
    "MELLON, TIMOTHY": { wiki: 14895190 }, // Timothy Mellon
    "ADELSON, MIRIAM": { wiki: 34504555 }, // Miriam Adelson
    "ADELSON, SHELDON": { wiki: 1599923 }, // Sheldon Adelson
    "GRIFFIN, KENNETH": { wiki: 2746299 }, // Ken Griffin
    "EYCHANER, FRED": { wiki: 39543796 }, // Fred Eychaner
    "BLOOMBERG, MICHAEL": { wiki: 38828 }, // Michael Bloomberg
    "MOSKOVITZ, DUSTIN": { wiki: 19601079 }, // Dustin Moskovitz
    "SCHWARZMAN, STEPHEN": { wiki: 885070 }, // Stephen A. Schwarzman
    "UIHLEIN, RICHARD": { wiki: 41292765 }, // Richard Uihlein
    "UIHLEIN, ELIZABETH": { wiki: 41292765 }, // Elizabeth Uihlein
    "SIMONS, JAMES": { wiki: 2430844 }, // Jim Simons
    "YASS, JEFFREY": { wiki: 7019305 }, // Jeff Yass
    "SINGER, PAUL": { wiki: 9577026 }, // Paul Singer
    "SCHWAB, CHARLES": { wiki: 1319448 }, // Charles R. Schwab
    "STEPHENS, WARREN": { wiki: 33810045 }, // Warren Stephens
    "SUSSMAN, DONALD": { wiki: 39602078 }, // Donald Sussman
    "HOFFMAN, REID": { wiki: 3591502 }, // Reid Hoffman
    "PRITZKER, JAY": { wiki: 25260370 }, // J. B. Pritzker
    "MCMAHON, LINDA": { wiki: 679668 }, // Linda McMahon
    "KOUM, JAN": { wiki: 41995116 }, // Jan Koum
    "HENDRICKS, DIANE": { wiki: 35873780 }, // Diane Hendricks
    "MARCUS, BERNARD": { wiki: 1215687 }, // Bernie Marcus
    "SOROS, GEORGE": { wiki: 6951166 }, // George Soros
    "SOROS, ALEXANDER": { wiki: 33106277 }, // Alexander Soros
    "SABAN, HAIM": { wiki: 5733711 }, // Haim Saban
    "GATES, MELINDA FRENCH": { wiki: 51725 }, // Melinda French Gates
    "GATES, WILLIAM H. III": { wiki: 3747 }, // Bill Gates
    "SKOLL, JEFF S.": { wiki: 1324462 }, // Jeffrey Skoll
    "BIGELOW, ROBERT": { wiki: 1516645 }, // Robert Bigelow
    "LUTNICK, HOWARD": { wiki: 33033512 }, // Howard Lutnick
    "WALTON, ROB": { wiki: 884991 }, // Rob Walton
    "WALTON, JIM C.": { wiki: 898634 }, // Jim Walton
    "PRATT, ANTHONY": { wiki: 13529427 }, // Anthony Pratt
    "PETERFFY, THOMAS": { wiki: 11326295 }, // Thomas Peterffy
    "MORITZ, MICHAEL": { wiki: 1164532 }, // Michael Moritz
    "HASTINGS, REED": { wiki: 632422 }, // Reed Hastings
    "BANKMAN-FRIED, SAMUEL": { wiki: 67428121 }, // Sam Bankman-Fried
    "KLARMAN, SETH": { wiki: 14570341 }, // Seth Klarman
    "WYNN, STEPHEN": { wiki: 698467 }, // Steve Wynn
    "STRYKER, JON": { wiki: 29392180 }, // Jon Stryker
    "LARSEN, CHRISTIAN": { wiki: 46549739 }, // Chris Larsen
    "SCHMIDT, ERIC": { wiki: 224584 }, // Eric Schmidt
    "MACFARLANE, SETH": { wiki: 383899 }, // Seth MacFarlane
    "SPIELBERG, STEVEN": { wiki: 26940 }, // Steven Spielberg
    "KATZENBERG, JEFFREY": { wiki: 576172 }, // Jeffrey Katzenberg
    "LAUDER, RONALD S.": { wiki: 5637902 }, // Ronald Lauder
    "KHOSLA, VINOD": { wiki: 226779 }, // Vinod Khosla
    "ROWAN, MARC": { wiki: 39886814 }, // Marc Rowan
    "THIEL, PETER": { wiki: 610532 }, // Peter Thiel
    "BENIOFF, MARC": { wiki: 7442138 }, // Marc Benioff
    "GEFFEN, DAVID": { wiki: 320917 }, // David Geffen
    "CROW, HARLAN": { wiki: 32142677 }, // Harlan Crow
    "RICKETTS, J. JOE": { wiki: 2813079 }, // Joe Ricketts
    "RICKETTS, TODD": { wiki: 47207612 }, // Todd Ricketts
    "RICKETTS, J. PETER": { wiki: 3379557 }, // Pete Ricketts
    "RICKETTS, LAURA": { wiki: 24954058 }, // Laura Ricketts
    "TEPPER, DAVID": { wiki: 4770341 }, // David Tepper
    "DOERR, JOHN III": { wiki: 1023840 }, // John Doerr
    "FISHER, KENNETH": { wiki: 5251744 }, // Kenneth Fisher
    "LUCKEY, PALMER": { wiki: 39555368 }, // Palmer Luckey
    "BONDERMAN, DAVID": { wiki: 9617923 }, // David Bonderman
    "PENSKE, ROGER": { wiki: 1170016 }, // Roger Penske
    "JOHNSON, ROBERT W. IV": { wiki: 1229489 }, // Woody Johnson
    "CATSIMATIDIS, JOHN": { wiki: 2875987 }, // John Catsimatidis
    "WARREN, KELCY": { wiki: 33892593 }, // Kelcy Warren
    "HAMM, HAROLD": { wiki: 30046202 }, // Harold Hamm
    "BALLMER, STEVEN": { wiki: 29656 }, // Steve Ballmer
    "BEKENSTEIN, JOSHUA": { wiki: 2842047 }, // Joshua Bekenstein
    "JOHNSON, SUZANNE NORA": { wiki: 9200653 }, // Suzanne Nora Johnson
    "JOBS, LAURENE POWELL": { wiki: 7334442 }, // Laurene Powell Jobs
    "HUNT, WOODY": { wiki: 69250458 }, // Woody Hunt

    // Major PACs, Organizations & Unions
    "FUTURE FORWARD USA ACTION": { wiki: 78264841 }, // Future Forward PAC
    "MAJORITY FORWARD": { wiki: 84220412 }, // Senate Majority PAC
    "HOUSE MAJORITY FORWARD": { wiki: 84220431 }, // House Majority PAC
    "ONE NATION": { wiki: 80550230 }, // Senate Leadership Fund
    "AMERICAN ACTION NETWORK": { wiki: 29203577 }, // American Action Network
    "STAND TOGETHER CHAMBER OF COMMERCE": { wiki: 63207191 }, // Stand Together
    "STAND TOGETHER CHAMBER OF COMMERCE INC.": { wiki: 63207191 }, // Stand Together
    "SAVE AMERICA": { wiki: 74161695 }, // Save America PAC
    "PRIORITIES USA": { wiki: 36376858 }, // Priorities USA Action
    "HILLARY VICTORY FUND": { wiki: 50022412 }, // Hillary Victory Fund
    SMP: { wiki: 84220412 }, // Senate Majority PAC
    "SENATE MAJORITY PAC": { wiki: 84220412 }, // Senate Majority PAC
    "DEMOCRACY PAC": { wiki: 6951166 }, // Democracy PAC (George Soros)
    "AMALGAMATED BANK": { wiki: 27532496 }, // Amalgamated Bank
    "SIXTEEN THIRTY FUND": { wiki: 65894017 }, // Sixteen Thirty Fund
    "LCV VICTORY FUND": { wiki: 472904 }, // League of Conservation Voters
    "AMERICAN FEDERATION OF STATE, COUNTY & MUNICIPAL EMPLOYEES": {
      wiki: 19288582,
    }, // AFSCME
    "NEA ADVOCACY FUND": { wiki: 527385 }, // National Education Association
    "AFT SOLIDARITY 527": { wiki: 591604 }, // American Federation of Teachers
    "LIUNA BUILDING AMERICA": { wiki: 2220978 }, // Laborers' International Union of North America
    "LABORERS' INTERNATIONAL UNION OF NORTH AMERICA (LIUNA) PAC": {
      wiki: 2220978,
    }, // LIUNA
    "LABORERS' INTERNATIONAL UNION OF NORTH AMERICA PAC": { wiki: 2220978 }, // LIUNA
    "UAW V CAP": { wiki: 320140 }, // United Auto Workers
    "AMERICA VOTES": { wiki: 1136615 }, // America Votes
    "EDF ACTION VOTES": { wiki: 1564855 }, // Environmental Defense Fund
    "IBEW PAC EDUCATIONAL FUND": { wiki: 1268745 }, // International Brotherhood of Electrical Workers
    "AMERICAN ISRAEL PUBLIC AFFAIRS COMMITTEE": { wiki: 183015 }, // AIPAC
    "KOCH INDUSTRIES INC": { wiki: 199026 }, // Koch Industries
    "CHEVRON CORPORATION": { wiki: 284749 }, // Chevron Corporation
    "AMERICAN PETROLEUM INSTITUTE": { wiki: 1691321 }, // American Petroleum Institute
    "NATIONAL ASSOCIATION OF REALTORS": { wiki: 440267 }, // National Association of Realtors
    "ALTRIA CLIENT SERVICES LLC": { wiki: 52638 }, // Altria
  },

  relations: [
    // Adelson family
    [
      ["ADELSON, MIRIAM", RelationKind.family],
      ["ADELSON, SHELDON", RelationKind.family],
    ],
    // Uihlein family
    [
      ["UIHLEIN, RICHARD", RelationKind.family],
      ["UIHLEIN, ELIZABETH", RelationKind.family],
    ],
    // Soros family
    [
      ["SOROS, GEORGE", RelationKind.family],
      ["SOROS, ALEXANDER", RelationKind.family],
    ],
    // Walton family
    [
      ["WALTON, ROB", RelationKind.family],
      ["WALTON, JIM C.", RelationKind.family],
    ],
    // Ricketts family
    [
      ["RICKETTS, J. JOE", RelationKind.family],
      ["RICKETTS, TODD", RelationKind.family],
      ["RICKETTS, J. PETER", RelationKind.family],
      ["RICKETTS, LAURA", RelationKind.family],
      ["RICKETTS, MARLENE", RelationKind.family],
    ],
  ],
};
