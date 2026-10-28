export interface PacAffiliationConfig {
  party: "DEM" | "REP" | "LIB" | "GRE" | "NON";
  expectedNames: string[];
}

/**
 * Monetary threshold (in USD) for auditing unmapped PACs.
 * Any unmapped committee with cumulative receipts >= this threshold
 * must be categorized or explicitly excluded.
 */
export const PAC_AUDIT_THRESHOLD = 5_000_000;

/**
 * Known Super PACs, Hybrid PACs, Joint Fundraising Committees (Type J),
 * and Bipartisan/Nonpartisan PACs mapped to their recipient party or "NON".
 *
 * Each entry requires `expectedNames` to guard against committee ID typos,
 * ensuring the ID matches FEC Committee Master records.
 *
 * Standard candidate and party committees with official party affiliations in cm.txt
 * are mapped automatically via CMTE_PTY_AFFILIATION.
 */
export const PAC_AFFILIATIONS: Record<string, PacAffiliationConfig> = {
  // Democratic Aligned Super PACs & Advocacy Funds
  C00484642: { party: "DEM", expectedNames: ["SENATE MAJORITY PAC", "SMP"] },
  C00495028: { party: "DEM", expectedNames: ["HOUSE MAJORITY PAC", "HMP"] },
  C00495861: { party: "DEM", expectedNames: ["PRIORITIES USA ACTION"] },
  C00669259: {
    party: "DEM",
    expectedNames: ["FUTURE FORWARD USA PAC", "FF PAC"],
  },
  C00492140: {
    party: "DEM",
    expectedNames: ["AMERICAN BRIDGE 21ST CENTURY", "AB PAC"],
  },
  C00725820: {
    party: "DEM",
    expectedNames: ["THE LINCOLN PROJECT", "LINCOLN PROJECT"],
  },
  C00701888: { party: "DEM", expectedNames: ["UNITE THE COUNTRY"] },
  C00640623: {
    party: "DEM",
    expectedNames: [
      "DOUG JONES FOR SENATE COMMITTEE",
      "RIGHT SIDE OF HISTORY PAC",
      "FORWARD MAJORITY",
    ],
  },
  C00786624: { party: "DEM", expectedNames: ["DEMOCRACY PAC II"] },
  C00693382: { party: "DEM", expectedNames: ["DEMOCRACY PAC"] },
  C00547349: {
    party: "DEM",
    expectedNames: [
      "NEXTGEN CLIMATE ACTION COMMITTEE",
      "NEXTGEN AMERICA",
      "STUDENT UNION",
    ],
  },
  C00486845: { party: "DEM", expectedNames: ["LCV VICTORY FUND"] },
  C00532705: { party: "DEM", expectedNames: ["INDEPENDENCE USA PAC"] },
  C00473918: { party: "DEM", expectedNames: ["WOMEN VOTE"] },
  C00620971: { party: "DEM", expectedNames: ["FOR OUR FUTURE"] },
  C00489799: { party: "DEM", expectedNames: ["PLANNED PARENTHOOD VOTES"] },
  C00418897: { party: "DEM", expectedNames: ["VOTEVETS"] },
  C00688655: {
    party: "DEM",
    expectedNames: ["EVERYTOWN FOR GUN SAFETY VICTORY FUND"],
  },
  C00503789: { party: "DEM", expectedNames: ["DGA ACTION"] },
  C00849729: { party: "DEM", expectedNames: ["LAST BEST PLACE PAC"] },
  C00631549: { party: "DEM", expectedNames: ["FORWARD MAJORITY ACTION"] },
  C00609388: { party: "DEM", expectedNames: ["BLACK PAC", "BLACKPAC"] },
  C00490847: {
    party: "DEM",
    expectedNames: ["WORKING FOR WORKING AMERICANS"],
  },
  C00489815: { party: "DEM", expectedNames: ["NEA ADVOCACY FUND"] },
  C00523621: { party: "DEM", expectedNames: ["UNITED WE CAN"] },
  C00923417: { party: "DEM", expectedNames: ["THINK BIG"] },
  C00915595: { party: "DEM", expectedNames: ["GOVERNMENT THAT WORKS PAC"] },
  C00918268: { party: "DEM", expectedNames: ["LONE STAR RISING PAC"] },
  C00928374: { party: "DEM", expectedNames: ["JOBS AND DEMOCRACY PAC"] },
  C00693515: { party: "DEM", expectedNames: ["FAIR FIGHT"] },
  C00754051: {
    party: "DEM",
    expectedNames: ["TAKE BACK 2020", "WORKERS VOTE"],
  },
  C00801514: { party: "DEM", expectedNames: ["PROTECT OUR FUTURE PAC"] },
  C00654053: {
    party: "DEM",
    expectedNames: ["THE PAC FOR AMERICA'S FUTURE", "FUTURE NOW FUND"],
  },
  C00804856: {
    party: "DEM",
    expectedNames: ["REPUBLICAN ACCOUNTABILITY PAC", "LF PAC"],
  },
  C00728360: { party: "DEM", expectedNames: ["MOVEMENT VOTER PAC"] },
  C00870030: { party: "DEM", expectedNames: ["MARYLAND'S FUTURE"] },
  C00606962: {
    party: "DEM",
    expectedNames: ["WORKING FAMILIES PARTY", "WFP NATIONAL PAC"],
  },
  C00886614: { party: "DEM", expectedNames: ["YOUR COMMUNITY PAC"] },
  C00724203: { party: "DEM", expectedNames: ["SOMOS PAC"] },
  C00952259: { party: "DEM", expectedNames: ["A STRONGER MICHIGAN"] },
  C00926204: { party: "DEM", expectedNames: ["AMERICAN FUTURE"] },
  C00911321: { party: "DEM", expectedNames: ["MD PAC"] },
  C00935973: { party: "DEM", expectedNames: ["NORTH STAR DAWN PAC"] },
  C00854059: { party: "DEM", expectedNames: ["ONE GIANT LEAP PAC"] },
  C00707844: { party: "DEM", expectedNames: ["EDF ACTION VOTES"] },
  C00902320: { party: "DEM", expectedNames: ["ILLINOIS FUTURE PAC"] },
  C00871368: { party: "DEM", expectedNames: ["PROJECT 218"] },
  C00936724: {
    party: "DEM",
    expectedNames: ["ELECT CHICAGO WOMEN", "ECW"],
  },
  C00936591: { party: "DEM", expectedNames: ["STAND FOR NEW YORK PAC"] },
  C00633248: { party: "DEM", expectedNames: ["314 ACTION FUND"] },
  C00531814: {
    party: "DEM",
    expectedNames: ["ENVIRONMENT AMERICA ACTION FUND"],
  },
  C00710848: { party: "DEM", expectedNames: ["DMFI PAC"] },
  C00484253: {
    party: "DEM",
    expectedNames: ["UNITED FOOD AND COMMERCIAL WORKERS", "UFCW"],
  },
  C00632133: { party: "DEM", expectedNames: ["SWING LEFT"] },
  C00638320: { party: "DEM", expectedNames: ["DAGA PAC", "DAGA"] },
  C00685719: { party: "DEM", expectedNames: ["DLGA"] },
  C00741769: { party: "DEM", expectedNames: ["STRATEGIC VICTORY FUND"] },
  C00845271: { party: "DEM", expectedNames: ["THE BENCH"] },
  C00854299: { party: "DEM", expectedNames: ["BOLD AMERICA"] },
  C00859660: { party: "DEM", expectedNames: ["NEW DEMOCRAT MAJORITY"] },
  C00863472: { party: "DEM", expectedNames: ["EDW ACTION FUND"] },
  C00922096: { party: "DEM", expectedNames: ["ADVANCE PROGRESS"] },
  C00928390: { party: "DEM", expectedNames: ["DEFENDING OUR VALUES PAC"] },
  C00932723: { party: "DEM", expectedNames: ["AMERICAN PRIORITIES"] },
  C00936997: {
    party: "DEM",
    expectedNames: ["INVEST IN TOMORROW COALITION PAC"],
  },
  C00949248: {
    party: "DEM",
    expectedNames: ["PRO-CHOICE MAJORITY ACTION"],
  },
  C00492520: {
    party: "DEM",
    expectedNames: ["AMERICA VOTES ACTION FUND"],
  },
  C00763193: {
    party: "DEM",
    expectedNames: ["GEORGIA HONOR"],
  },
  C00739110: {
    party: "DEM",
    expectedNames: ["PERSIST PAC"],
  },
  C00817536: {
    party: "DEM",
    expectedNames: ["CLIMATE POWER ACTION"],
  },
  C00756569: {
    party: "DEM",
    expectedNames: ["WORKER POWER PAC"],
  },
  C00878009: {
    party: "DEM",
    expectedNames: ["EVERYTOWN-DEMAND A SEAT PAC"],
  },
  C00848440: {
    party: "DEM",
    expectedNames: ["PROTECT PROGRESS"],
  },
  C00764233: {
    party: "DEM",
    expectedNames: ["DEFEND THE VOTE"],
  },
  C00812495: {
    party: "DEM",
    expectedNames: [
      "STATE + LOCAL ELECTION ALLIANCE",
      "STATE DEMOCRACY DEFENDERS PAC",
    ],
  },
  C00757419: {
    party: "DEM",
    expectedNames: ["SD PAC", "SAVE DEMOCRACY PAC"],
  },
  C00540443: {
    party: "DEM",
    expectedNames: ["GIFFORDS PAC", "AMERICANS FOR RESPONSIBLE SOLUTIONS-PAC"],
  },

  // Democratic Joint Fundraising Committees (Type J)
  C00744946: {
    party: "DEM",
    expectedNames: ["BIDEN VICTORY FUND", "HARRIS VICTORY FUND"],
  },
  C00745976: { party: "DEM", expectedNames: ["HARRIS VICTORY FUND"] },
  C00586982: {
    party: "DEM",
    expectedNames: ["KAMALA HARRIS VICTORY FUND", "HARRIS VICTORY FUND"],
  },
  C00838912: { party: "DEM", expectedNames: ["HARRIS ACTION FUND"] },
  C00746651: { party: "DEM", expectedNames: ["BIDEN ACTION FUND"] },
  C00586537: { party: "DEM", expectedNames: ["HILLARY VICTORY FUND"] },
  C00619411: { party: "DEM", expectedNames: ["HILLARY ACTION FUND"] },
  C00492421: { party: "DEM", expectedNames: ["NANCY PELOSI VICTORY FUND"] },
  C00768200: { party: "DEM", expectedNames: ["JEFFRIES VICTORY FUND"] },
  C00658476: {
    party: "DEM",
    expectedNames: ["DEMOCRATIC GRASSROOTS VICTORY FUND"],
  },
  C00913574: { party: "DEM", expectedNames: ["COOPER VICTORY FUND"] },
  C00941567: {
    party: "DEM",
    expectedNames: ["HOUSE VICTORY PROJECT"],
  },
  C00873406: {
    party: "DEM",
    expectedNames: ["HOUSE VICTORY PROJECT 2024", "HOUSE VICTORY PROJECT"],
  },
  C00817361: {
    party: "DEM",
    expectedNames: ["HOUSE VICTORY PROJECT 2022", "HOUSE VICTORY PROJECT"],
  },
  C00729657: {
    party: "DEM",
    expectedNames: ["HOUSE VICTORY PROJECT 2020", "HOUSE VICTORY PROJECT"],
  },
  C00675488: {
    party: "DEM",
    expectedNames: ["HOUSE VICTORY PROJECT"],
  },
  C00740597: {
    party: "DEM",
    expectedNames: ["WARNOCK VICTORY FUND"],
  },
  C00752691: {
    party: "DEM",
    expectedNames: ["ONE FOR ALL COMMITTEE"],
  },
  C00836353: {
    party: "DEM",
    expectedNames: ["NEWSOM FOR CALIFORNIA GOVERNOR 2022"],
  },
  C00750919: {
    party: "DEM",
    expectedNames: ["OSSOFF VICTORY FUND"],
  },
  C00958066: {
    party: "DEM",
    expectedNames: ["ABDUL FOR MICHIGAN VICTORY FUND"],
  },

  // Republican Aligned Super PACs
  C00571703: {
    party: "REP",
    expectedNames: ["SENATE LEADERSHIP FUND", "SLF PAC"],
  },
  C00504530: {
    party: "REP",
    expectedNames: ["CONGRESSIONAL LEADERSHIP FUND", "CLF"],
  },
  C00487470: { party: "REP", expectedNames: ["CLUB FOR GROWTH ACTION"] },
  C00687103: {
    party: "REP",
    expectedNames: ["AMERICANS FOR PROSPERITY ACTION"],
  },
  C00825851: { party: "REP", expectedNames: ["MAKE AMERICA GREAT AGAIN INC"] },
  C00892471: { party: "REP", expectedNames: ["MAGA INC"] },
  C00580100: {
    party: "REP",
    expectedNames: [
      "MAKE AMERICA GREAT AGAIN PAC",
      "DONALD J. TRUMP FOR PRESIDENT",
    ],
  },
  C00762591: { party: "REP", expectedNames: ["SAVE AMERICA"] },
  C00879510: { party: "REP", expectedNames: ["AMERICA PAC"] },
  C00571372: { party: "REP", expectedNames: ["RIGHT TO RISE USA"] },
  C00618371: {
    party: "REP",
    expectedNames: [
      "AMERICA FIRST ACTION",
      "TRUMP MAKE AMERICA GREAT AGAIN COMMITTEE",
    ],
  },
  C00637512: { party: "REP", expectedNames: ["AMERICA FIRST ACTION"] },
  C00878801: { party: "REP", expectedNames: ["PRESERVE AMERICA PAC"] },
  C00756882: { party: "REP", expectedNames: ["PRESERVE AMERICA PAC"] },
  C00622027: { party: "REP", expectedNames: ["PRESERVE AMERICA PAC"] },
  C00834077: { party: "REP", expectedNames: ["NEVER BACK DOWN"] },
  C00571588: {
    party: "REP",
    expectedNames: ["RESTORATION PAC", "RESTORATION OF AMERICA PAC"],
  },
  C00487363: { party: "REP", expectedNames: ["AMERICAN CROSSROADS"] },
  C00867036: { party: "REP", expectedNames: ["RIGHT FOR AMERICA"] },
  C00541292: { party: "REP", expectedNames: ["CONSERVATIVE SOLUTIONS PAC"] },
  C00576108: { party: "REP", expectedNames: ["UNINTIMIDATED PAC"] },
  C00544544: {
    party: "REP",
    expectedNames: ["NEW REPUBLICAN PAC", "NEW REPUBLICAN"],
  },
  C00564765: {
    party: "REP",
    expectedNames: ["FREEDOM PARTNERS ACTION FUND"],
  },
  C00618876: { party: "REP", expectedNames: ["REBUILDING AMERICA NOW"] },
  C00574533: { party: "REP", expectedNames: ["FUTURE45"] },
  C00575423: { party: "REP", expectedNames: ["KEEP THE PROMISE III"] },
  C00575373: { party: "REP", expectedNames: ["MAKE AMERICA NUMBER 1"] },
  C00490730: { party: "REP", expectedNames: ["RGA RIGHT DIRECTION PAC"] },
  C00844613: { party: "REP", expectedNames: ["WIN IT BACK PAC"] },
  C00849489: { party: "REP", expectedNames: ["KEYSTONE RENEWAL PAC"] },
  C00804104: { party: "REP", expectedNames: ["WISCONSIN TRUTH PAC"] },
  C00777185: { party: "REP", expectedNames: ["SAVING ARIZONA PAC"] },
  C00770495: { party: "REP", expectedNames: ["PROTECT OHIO VALUES PAC"] },
  C00927186: { party: "REP", expectedNames: ["AMERICAN CONSERVATIVE FUND"] },
  C00892919: {
    party: "REP",
    expectedNames: [
      "V-PAC: VICTORS, NOT VICTIMS",
      "V-PAC",
      "MAKE AMERICA GREATER",
    ],
  },
  C00855924: { party: "REP", expectedNames: ["CONSERVATIVE AMERICANS PAC"] },
  C00542217: {
    party: "REP",
    expectedNames: ["TEXANS FOR A CONSERVATIVE MAJORITY"],
  },
  C00559740: { party: "REP", expectedNames: ["GOPAC ELECTION FUND"] },
  C00916692: { party: "REP", expectedNames: ["AMERICAN MISSION"] },
  C00911610: { party: "REP", expectedNames: ["DIGITAL FREEDOM FUND"] },
  C00580381: { party: "REP", expectedNames: ["GRANITE STATE SOLUTIONS"] },
  C00573055: { party: "REP", expectedNames: ["AMERICA LEADS"] },
  C00668301: { party: "REP", expectedNames: ["DEFENDARIZONA"] },
  C00762377: { party: "REP", expectedNames: ["PEACHTREE PAC"] },
  C00750323: { party: "REP", expectedNames: ["GEORGIA UNITED VICTORY"] },
  C00750182: { party: "REP", expectedNames: ["OPPORTUNITY MATTERS FUND"] },
  C00794891: { party: "REP", expectedNames: ["AMERICAN LEADERSHIP ACTION"] },
  C00798116: { party: "REP", expectedNames: ["HONOR PENNSYLVANIA"] },
  C00883520: { party: "REP", expectedNames: ["TURNOUT FOR AMERICA"] },
  C00796045: { party: "REP", expectedNames: ["TRUTH AND COURAGE PAC"] },
  C00811166: { party: "REP", expectedNames: ["THE SENTINEL ACTION FUND"] },
  C00782664: { party: "REP", expectedNames: ["AMERICA FUND"] },
  C00881987: { party: "REP", expectedNames: ["DUTY TO AMERICA PAC"] },
  C00853861: { party: "REP", expectedNames: ["GLCF, INC."] },
  C00840546: { party: "REP", expectedNames: ["TRUST IN THE MISSION PAC"] },
  C00891291: { party: "REP", expectedNames: ["RBG PAC"] },
  C00894709: { party: "REP", expectedNames: ["PINE TREE RESULTS PAC"] },
  C00794396: { party: "REP", expectedNames: ["SCHOOL FREEDOM FUND"] },
  C00835967: {
    party: "REP",
    expectedNames: ["CONSERVATIVES FOR AMERICAN EXCELLENCE"],
  },
  C00896365: { party: "REP", expectedNames: ["KEEP AMERICA GREAT PAC"] },
  C00560904: { party: "REP", expectedNames: ["RAGA ACTION FUND"] },
  C00898130: { party: "REP", expectedNames: ["FIGHT FOR KENTUCKY"] },
  C00906701: {
    party: "REP",
    expectedNames: ["AMERICA FIRST AGRICULTURE ACTION"],
  },
  C00749671: {
    party: "REP",
    expectedNames: ["CITIZENS FOR FREE ENTERPRISE"],
  },
  C00898924: { party: "REP", expectedNames: ["STRONGER SAFER NATION"] },
  C00906263: { party: "REP", expectedNames: ["LOUISIANA FREEDOM FUND"] },
  C00528554: {
    party: "REP",
    expectedNames: [
      "RJC VICTORY FUND",
      "REPUBLICAN JEWISH COALITION VICTORY FUND",
    ],
  },
  C00530766: { party: "REP", expectedNames: ["WOMEN SPEAK OUT PAC"] },
  C00779595: { party: "REP", expectedNames: ["RSLC PAC"] },
  C00908723: { party: "REP", expectedNames: ["MAGA KY"] },
  C00544387: {
    party: "REP",
    expectedNames: [
      "AMERICAN PRINCIPLES PROJECT",
      "CAMPAIGN FOR AMERICAN PRINCIPLES",
    ],
  },
  C00573733: {
    party: "REP",
    expectedNames: ["SECURITY IS STRENGTH PAC"],
  },
  C00657866: {
    party: "REP",
    expectedNames: ["PROTECT FREEDOM"],
  },
  C00731133: {
    party: "REP",
    expectedNames: ["MAKE LIBERTY WIN"],
  },
  C00789933: {
    party: "REP",
    expectedNames: ["CITIZENS ALLIANCE"],
  },
  C00804690: {
    party: "REP",
    expectedNames: ["AMERICA 21 PAC"],
  },
  C00814152: {
    party: "REP",
    expectedNames: ["TURNING POINT PAC"],
  },
  C00824292: {
    party: "REP",
    expectedNames: ["AMERICAN LEADERSHIP PAC"],
  },
  C00843433: {
    party: "REP",
    expectedNames: ["AMERICAN RIGHTS AND REFORM PAC", "LEGALIZE AMERICA"],
  },
  C00846683: {
    party: "REP",
    expectedNames: ["AFC VICTORY FUND"],
  },
  C00875278: {
    party: "REP",
    expectedNames: ["LAST FRONTIER PAC"],
  },
  C00893537: {
    party: "REP",
    expectedNames: ["FIRST PRINCIPLES PAC"],
  },
  C00901223: {
    party: "REP",
    expectedNames: ["LONE STAR LIBERTY PAC"],
  },
  C00925560: {
    party: "REP",
    expectedNames: ["WIN FOR PENNSYLVANIA"],
  },
  C00930438: {
    party: "REP",
    expectedNames: ["ALABAMA FREEDOM FUND"],
  },
  C00932418: {
    party: "REP",
    expectedNames: ["TEXANS FOR TRUTH AND LIBERTY PAC"],
  },
  C00932707: {
    party: "REP",
    expectedNames: ["CONSERVATIVE TEXANS PAC"],
  },
  C00934653: {
    party: "REP",
    expectedNames: ["STW PAC"],
  },
  C00940957: {
    party: "REP",
    expectedNames: ["ACCOUNTABILITY PROJECT"],
  },
  C00943753: {
    party: "REP",
    expectedNames: ["KENTUCKY 4TH PAC"],
  },
  C00948695: {
    party: "REP",
    expectedNames: ["TEXANS DEMANDING ACCOUNTABILITY"],
  },
  C00952994: {
    party: "REP",
    expectedNames: ["AMERICAN MAJORITY ACTION PAC"],
  },
  C00842344: {
    party: "REP",
    expectedNames: ["BEST OF AMERICA PAC"],
  },
  C00857011: {
    party: "REP",
    expectedNames: ["FIGHT RIGHT INC"],
  },
  C00841593: {
    party: "REP",
    expectedNames: ["TELL IT LIKE IT IS PAC"],
  },
  C00834630: {
    party: "REP",
    expectedNames: ["BUCKEYE VALUES PAC"],
  },
  C00693838: {
    party: "REP",
    expectedNames: ["MORE JOBS, LESS GOVERNMENT"],
  },
  C00876482: {
    party: "REP",
    expectedNames: ["RETIRE CAREER POLITICIANS"],
  },
  C00763185: {
    party: "REP",
    expectedNames: ["THE GEORGIA WAY"],
  },
  C00790477: {
    party: "REP",
    expectedNames: ["MAKE AMERICA GREAT AGAIN, AGAIN! INC."],
  },
  C00805283: {
    party: "REP",
    expectedNames: ["FAIR COURTS AMERICA"],
  },
  C00489856: {
    party: "REP",
    expectedNames: ["ESAFUND"],
  },
  C00825158: {
    party: "REP",
    expectedNames: ["OPPORTUNITY MATTERS FUND ACTION"],
  },
  C00864926: {
    party: "REP",
    expectedNames: ["AMERICA LEADS ACTION INC."],
  },
  C00870592: {
    party: "REP",
    expectedNames: ["FIX WASHINGTON PAC"],
  },
  C00837427: {
    party: "REP",
    expectedNames: ["PROJECT RESCUE AMERICA"],
  },
  C00833749: {
    party: "REP",
    expectedNames: ["AMERICAN EXCEPTIONALISM PAC"],
  },
  C00552851: {
    party: "REP",
    expectedNames: ["FREEDOM CAUCUS FUND", "HOUSE FREEDOM FUND"],
  },

  // Republican Joint Fundraising Committees (Type J)
  C00858373: { party: "REP", expectedNames: ["GROW THE MAJORITY"] },
  C00867937: { party: "REP", expectedNames: ["TRUMP 47 COMMITTEE"] },
  C00618389: { party: "REP", expectedNames: ["TRUMP VICTORY"] },
  C00770941: {
    party: "REP",
    expectedNames: ["TRUMP SAVE AMERICA JOINT FUNDRAISING"],
  },
  C00638007: { party: "REP", expectedNames: ["MCCONNELL VICTORY COMMITTEE"] },
  C00535161: { party: "REP", expectedNames: ["MCCONNELL VICTORY COMMITTEE"] },
  C00766782: { party: "REP", expectedNames: ["TAKE BACK THE HOUSE 2022"] },
  C00695585: { party: "REP", expectedNames: ["TAKE BACK THE HOUSE 2020"] },
  C00831925: { party: "REP", expectedNames: ["PROTECT THE HOUSE"] },
  C00669622: { party: "REP", expectedNames: ["PROTECT THE HOUSE"] },
  C00837518: { party: "REP", expectedNames: ["NRSC VICTORY"] },
  C00699546: { party: "REP", expectedNames: ["NRSC VICTORY"] },
  C00888586: { party: "REP", expectedNames: ["NRCC VICTORY"] },
  C00546663: {
    party: "REP",
    expectedNames: ["NRSC/NRCC VICTORY COMMITTEE", "VICTORY COMMITTEE"],
  },
  C00545947: { party: "REP", expectedNames: ["TEAM RYAN"] },
  C00736967: {
    party: "REP",
    expectedNames: ["SENATE GEORGIA BATTLEGROUND FUND"],
  },
  C00895821: { party: "REP", expectedNames: ["DEFEND OUR MAJORITY"] },
  C00859058: { party: "REP", expectedNames: ["EMMER MAJORITY BUILDERS"] },
  C00866947: {
    party: "REP",
    expectedNames: ["CORNYN LONESTAR VICTORY FUND", "LONESTAR VICTORY FUND"],
  },
  C00914176: { party: "REP", expectedNames: ["WHATLEY VICTORY COMMITTEE"] },
  C00771246: {
    party: "REP",
    expectedNames: ["JOHNSON LEADERSHIP FUND"],
  },
  C00897918: {
    party: "REP",
    expectedNames: ["ONE TEAM SENATE MAJORITY"],
  },
  C00568162: {
    party: "REP",
    expectedNames: ["SCALISE LEADERSHIP FUND"],
  },
  C00857144: {
    party: "REP",
    expectedNames: ["SCALISE LEADERSHIP FUND 2024"],
  },
  C00541011: {
    party: "REP",
    expectedNames: ["MCCARTHY VICTORY FUND"],
  },
  C00770180: {
    party: "REP",
    expectedNames: ["CORNYN VICTORY COMMITTEE"],
  },
  C00849778: {
    party: "REP",
    expectedNames: ["TED CRUZ VICTORY FUND"],
  },
  C00828152: {
    party: "REP",
    expectedNames: ["TEAM STAND FOR AMERICA"],
  },
  C00873893: {
    party: "REP",
    expectedNames: ["TRUMP NATIONAL COMMITTEE JFC, INC."],
  },
  C00869024: {
    party: "REP",
    expectedNames: ["HOGAN VICTORY FUND"],
  },
  C00867010: {
    party: "REP",
    expectedNames: ["TEAM MORENO"],
  },
  C00852012: {
    party: "REP",
    expectedNames: ["TEAM MCCORMICK"],
  },
  C00676957: {
    party: "REP",
    expectedNames: ["RICK SCOTT VICTORY FUND"],
  },
  C00837435: {
    party: "REP",
    expectedNames: ["2024 THUNE REPUBLICAN SENATE VICTORY"],
  },
  C00724344: {
    party: "REP",
    expectedNames: ["NRSC TARGETED STATE VICTORY"],
  },
  C00679381: {
    party: "REP",
    expectedNames: ["NRSC TARGETED STATE VICTORY FUND"],
  },
  C00617498: {
    party: "REP",
    expectedNames: ["NRSC TARGETED STATE VICTORY COMMITTEE"],
  },
  C00838169: {
    party: "REP",
    expectedNames: ["REPUBLICAN LEADERSHIP FUND INC."],
  },
  C00790923: {
    party: "REP",
    expectedNames: ["BUCKEYE LEADERSHIP FUND, INC."],
  },

  // Bipartisan, Nonpartisan & Independent Super PACs
  C00835959: { party: "NON", expectedNames: ["FAIRSHAKE"] },
  C00799031: {
    party: "NON",
    expectedNames: ["UNITED DEMOCRACY PROJECT", "UDP"],
  },
  C00488742: {
    party: "NON",
    expectedNames: ["NATIONAL ASSOCIATION OF REALTORS CONGRESSIONAL FUND"],
  },
  C00659011: { party: "NON", expectedNames: ["WITH HONOR FUND"] },
  C00831404: { party: "NON", expectedNames: ["WITH HONOR FUND II"] },
  C00898890: { party: "NON", expectedNames: ["WITH HONOR FUND III"] },
  C00916114: { party: "NON", expectedNames: ["LEADING THE FUTURE"] },
  C00925586: { party: "NON", expectedNames: ["WIN FOR AMERICA"] },
  C00677773: { party: "NON", expectedNames: ["UNITE AMERICA"] },
  C00915181: { party: "NON", expectedNames: ["FELLOWSHIP PAC"] },
  C00821439: {
    party: "NON",
    expectedNames: [
      "AMERICAN VALUES 2024",
      "MAHA PAC",
      "PEOPLE'S PHARMA MOVEMENT",
    ],
  },
  C00836916: {
    party: "NON",
    expectedNames: ["TEAM KENNEDY"],
  },
  C00883751: {
    party: "NON",
    expectedNames: ["KENNEDY VICTORY FUND 2024", "KENNEDY VICTORY FUND"],
  },
  C00888172: {
    party: "NON",
    expectedNames: ["MAHA ALLIANCE"],
  },
};

/**
 * Conduits where earmarked contributions pass through.
 * Their forwarded records (transaction type 24T) and pass-through entries
 * must not be ingested as direct receipts to avoid double-counting the recipient.
 */
export const CONDUIT_COMMITTEES = new Set([
  "C00401224", // ActBlue
  "C00694323", // WinRed
]);

/**
 * Committees excluded from ingestion and discovery audits due to fictitious/unverified
 * filings (e.g. C00616078 "GET OUR JOBS BACK, INC", a 2016 paper-only $50M in-kind claim
 * filed by convicted Ponzi schemer Steven Hoffenberg with no actual cash flow).
 */
export const EXCLUDED_COMMITTEES = new Set([
  "C00616078", // Get Our Jobs Back, Inc. (fictitious $50M filing in 2016)
]);
