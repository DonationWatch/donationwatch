import fs from "fs/promises";
import path from "path";

import type { Countries } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";
import { Country } from "@/utils/countries";
import { AddressField, DonationField, DonorType } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";

type GeDonationType =
  | "#10 - ფულადი შემოწირულებები"
  | "#11 - არაფულადი შემოწირულებები"
  | "#14 - ფულადი საწევრო შენატანები"
  | "#16 - იურიდიული პირის მიერ განხორციელებული ფულადი შემოწირულებები"
  | "#17 - იურიდიული პირის მიერ განხორციელებული არაფულადი შემოწირულებები";

type GeLegalForm =
  | "არასამეწარმეო (არაკომერციული) იურ. პირი"
  | "ინდ. მეწარმე"
  | "სააქციო საზოგადოება"
  | "სპს"
  | "უცხოური საწარმოს ფილიალი"
  | "ფიზიკური პირი"
  | "შპს";

const legalFormMappings: Record<GeLegalForm, DonorType> = {
  "არასამეწარმეო (არაკომერციული) იურ. პირი": DonorType.NonProfitLegalEntity,
  "ინდ. მეწარმე": DonorType.Individual,
  "სააქციო საზოგადოება": DonorType.Company,
  სპს: DonorType.Company,
  "უცხოური საწარმოს ფილიალი": DonorType.Company,
  "ფიზიკური პირი": DonorType.Individual,
  შპს: DonorType.Company,
};

interface GeJsonDonor {
  type: string;
  legal_form: GeLegalForm;
  name: string;
  number: string;
  person_id: string;
  person_name: string;
  person_surname: string;
  legal_name: string;
  legal_id: string;
}

interface GeJsonPolitician {
  name: string;
  name_en: string | null;
}

interface GeJsonItem {
  form_id: GeDonationType;
  amount: string;
  date: string;
  donor: GeJsonDonor;
  politician: GeJsonPolitician;
  verified_amount: string;
}

interface GeJsonResponse {
  data: GeJsonItem[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

export class GeLoader extends DataLoader {
  constructor() {
    super("GE", Country.georgia);
  }

  parties: Record<string, PartyConfig> = {
    "ქრისტიან-დემოკრატიული პარტია": {
      name: "ქრისტიან-დემოკრატიული პარტია",
      code: "CDP",
      short: "Christian Democratic Party",
      color: "#bfa063",
    },
    "დემოკრატიული მოძრაობა-ერთიანი საქართველო": {
      name: "დემოკრატიული მოძრაობა-ერთიანი საქართველო",
      code: "DEMOCRATS",
      short: "Democratic Movement-United Georgia",
      wiki: 22190571,
      color: "#1a1275",
    },
    "ეროვნულ-დემოკრატიული პარტია": {
      name: "ეროვნულ-დემოკრატიული პარტია",
      code: "NDP",
      short: "National Democratic Party",
      wiki: 2024940,
      color: "#b5011e",
    },
    "ახალი მემარჯვენეები": {
      name: "ახალი მემარჯვენეები",
      code: "NRP",
      short: "New Rights Party",
      wiki: 2024912,
      color: "#8cd309",
    },
    "საქართველოს რესპუბლიკური პარტია": {
      name: "საქართველოს რესპუბლიკური პარტია",
      short: "Republican Party of Georgia",
      code: "REPUBLICANS",
      wiki: 17243090,
      color: "#f6741e",
    },
    "ქართული პარტია": {
      name: "ქართული პარტია",
      short: "Georgian Party",
      code: "GP",
      color: "#721f4b",
    },
    "თავისუფალი დემოკრატები": {
      name: "თავისუფალი დემოკრატები",
      short: "Free Democrats",
      code: "FD",
      wiki: 23638096,
      color: "#013088",
    },
    "ერთიანობა - ნაციონალური მოძრაობა": {
      name: "ერთიანი ნაციონალური მოძრაობა",
      short: "United National Movement",
      code: "UNM",
      wiki: 421164,
      color: "#ef3946",
    },
    "ქრისტიან-დემოკრატიული სახალხო პარტია": {
      name: "ქრისტიან-დემოკრატიული სახალხო პარტია",
      short: "Christian Democratic People's Party",
      code: "CDPP",
      color: "#871417",
    },
    "საქართველოს ერთიანი კომუნისტური პარტია": {
      name: "საქართველოს ერთიანი კომუნისტური პარტია",
      short: "United Communist Party of Georgia",
      code: "SEKP",
      wiki: 427416,
      color: "#bf392b",
    },
    "ევროპული საქართველო - მოძრაობა თავისუფლებისთვის": {
      name: "ევროპული საქართველო - მოძრაობა თავისუფლებისთვის",
      short: "European Georgia - Movement for Freedom",
      code: "EG",
      wiki: 52846162,
      color: "#ed1f47",
    },
    "მოძრაობა თავისუფალი საქართველოსთვის": {
      name: "მოძრაობა თავისუფალი საქართველოსთვის",
      short: "Movement for a Free Georgia",
      code: "MFG",
      color: "#a20031",
    },
    "სტრატეგია აღმაშენებელი": {
      name: "სტრატეგია აღმაშენებელი",
      short: "Strategy Aghmashenebeli",
      code: "AGHMASHENEBELI",
      wiki: 55266516,
      color: "#ff0000",
    },
    "სოციალ-დემოკრატიული პარტია": {
      name: "სოციალ-დემოკრატიული პარტია",
      short: "Social Democratic Party",
      code: "SDP",
      color: "#ff0001",
    },
    "სოციალ-დემოკრატები საქართველოს განვითარებისთვის": {
      name: "სოციალ-დემოკრატები საქართველოს განვითარებისთვის",
      short: "Social Democrats for the Development of Georgia",
      code: "SDD",
      wiki: 38482817,
      color: "#ec2e34",
    },
    "საზოგადოებრივი მოძრაობა ლელო": {
      name: "საზოგადოებრივი მოძრაობა ლელო",
      short: "Public Movement Lelo",
      code: "LELO",
      wiki: 62948704,
      color: "#f0cd14",
    },
    "ქართული ოცნება-დემოკრატიული საქართველო": {
      name: "ქართული ოცნება-დემოკრატიული საქართველო",
      short: "Georgian Dream-Democratic Georgia",
      code: "GD",
      wiki: 35807631,
      color: "#fdb80c",
    },
    "თავისუფალი საქართველო": {
      name: "თავისუფალი საქართველო",
      short: "Free Georgia",
      code: "FG",
      wiki: 42580018,
      color: "#a20030",
    },
    "ძლიერი საქართველო - ლელო, ხალხისთვის, თავისუფლებისთვის!": {
      name: "ძლიერი საქართველო - ლელო, ხალხისთვის, თავისუფლებისთვის!",
      short: "Strong Georgia - Lelo, for the people, for freedom!",
      code: "DZLIERI",
      color: "#FBAF12",
    },
    "საქართველოს პატრიოტთა ალიანსი": {
      name: "საქართველოს პატრიოტთა ალიანსი",
      short: "Alliance of Patriots of Georgia",
      code: "APG",
      wiki: 49122553,
      color: "#e1ab2c",
    },
    "კოალიცია ცვლილებისთვის გვარამია მელია გირჩი დროა": {
      name: "კოალიცია ცვლილებისთვის გვარამია მელია გირჩი დროა",
      short: "Coalition for Change Gvaramia Melia Girchi It's Time",
      code: "AHALI",
      color: "#f78934",
    },
    რეფორმერი: {
      name: "რეფორმერი",
      short: "Reformer",
      code: "REFORMER",
      color: "#414142",
    },
    "შეცვალე საქართველო": {
      name: "შეცვალე საქართველო",
      short: "Change Georgia",
      code: "CHANGEGE",
      color: "#111e31",
    },
    "მ.პ.გ ქართული ფესვები": {
      name: "მ.პ.გ ქართული ფესვები",
      short: "M.P.G. Georgian Roots",
      code: "ROOTS",
      color: "#86acbb",
    },
    "ქართული მარში - ეროვნული მოძრაობა": {
      name: "ქართული მარში - ეროვნული მოძრაობა",
      short: "Georgian March - National Movement",
      code: "MARCH",
      wiki: 57295894,
      color: "#1a1e21",
    },
    "ქრისტიან-დემოკრატიული მოძრაობა": {
      name: "ქრისტიან-დემოკრატიული მოძრაობა",
      short: "Christian-Democratic Movement",
      wiki: 17244007,
      color: "#c0a163",
      code: "KDM",
    },
    "საქართველოს ლეიბორისტული პარტია": {
      name: "საქართველოს ლეიბორისტული პარტია",
      short: "Georgian Labour Party",
      code: "SLP",
      color: "#e20138",
      wiki: 11660172,
    },
    "ანა დოლიძე დამოუკიდებელი კანდიდატი": {
      name: "ანა დოლიძე დამოუკიდებელი კანდიდატი",
      short: "Ana Dolidze Independent Candidate",
      code: "DOLIDZE",
      color: "#d83133",
    },
    "ჩვენი საქართველო - სოლიდარობის ალიანსი": {
      name: "ჩვენი საქართველო - სოლიდარობის ალიანსი",
      short: "Our Georgia - Solidarity Alliance",
      code: "SOLIDARITY",
      wiki: 64755041,
      color: "#113a58",
    },
    "სოციალური სამართლიანობისათვის": {
      name: "სოციალური სამართლიანობისათვის",
      short: "For social justice",
      code: "FSJ",
      color: "#1f2d35",
    },
    "ევროპელი სოციალისტები": {
      name: "ევროპელი სოციალისტები",
      short: "European Socialists",
      code: "EUSOCIALISTS",
      color: "#334d9a",
      wiki: 68706152,
    },
    "გახარია საქართველოსთვის": {
      name: "გახარია საქართველოსთვის",
      short: "For Georgia",
      code: "FORGEO",
      color: "#621f8d",
      wiki: 67816600,
    },
    "ანა დოლიძე - ხალხისთვის": {
      name: "ანა დოლიძე - ხალხისთვის",
      short: "Ana Dolidze - For the People",
      code: "FORPEOPLE",
      color: "#f4730c",
      wiki: 70354278,
    },
    "ელენე ხოშტარია - დროა": {
      name: "ელენე ხოშტარია - დროა",
      short: "Elene Khoshtaria - It's time",
      code: "ITSTIME",
      color: "#111111",
    },
    "კონსერვატიული მოძრაობა": {
      name: "კონსერვატიული მოძრაობა",
      short: "Conservative movement",
      code: "CONSERVATIVEMOV",
      color: "#5e1117",
    },
    "თაობები საქართველოსთვის": {
      name: "თაობები საქართველოსთვის",
      short: "Generations for Georgia",
      code: "GEGENERATIONS",
      color: "#cb6a0c",
    },
    "ხალხის ძალა": {
      name: "ხალხის ძალა",
      short: "People's Power",
      code: "PEOPLEPOWER",
      color: "#224682",
      wiki: 72031111,
    },
    "საქართველოს ქრისტიან-კონსერვატიული პარტია": {
      name: "საქართველოს ქრისტიან-კონსერვატიული პარტია",
      short: "Christian Conservative Party of Georgia",
      code: "CHRISTIANCONSERVATIVE",
      color: "#530207",
    },
    "მრეწველობა გადაარჩენს საქართველოს": {
      name: "მრეწველობა გადაარჩენს საქართველოს",
      short: "Industry Will Save Georgia",
      code: "INDUSTRY",
      color: "#5e1317",
      wiki: 2024921,
    },
    "საქართველოს კონსერვატიული პარტია": {
      name: "საქართველოს კონსერვატიული პარტია",
      short: "Conservative Party of Georgia",
      code: "CONSERVATIVES",
      color: "#993333",
      wiki: 17243670,
    },
    "ხალხის პარტია": {
      name: "ხალხის პარტია",
      short: "People's Party",
      code: "PEOPLE",
      color: "#ba2927",
      wiki: 61106151,
    },
    "რესპუბლიკური ინსტიტუტი": {
      name: "რესპუბლიკური ინსტიტუტი",
      short: "Republican Institute",
      code: "REPUBLICANINSTITUTE",
      color: "#ff0004",
    },
    "განახლებული საქართველოსთვის": {
      name: "განახლებული საქართველოსთვის",
      short: "For a renewed Georgia",
      code: "PPGS",
      color: "#082366",
    },
    "საზოგადოებრივი მოძრაობა ქართული ოცნება": {
      name: "საზოგადოებრივი მოძრაობა ქართული ოცნება",
      short: "Public Movement Georgian Dream",
      code: "GEORGIANDREAM",
      color: "#ff0006",
    },
    "ეროვნული ფორუმი": {
      name: "ეროვნული ფორუმი",
      short: "National Forum",
      code: "NATIONALFORUM",
      color: "#fbeb00",
      wiki: 27717386,
    },
    "საქართველო არ იყიდება": {
      name: "საქართველო არ იყიდება",
      short: "Georgia is not for sale.",
      code: "NOTFORSALE",
      color: "#b48388",
    },
    "ვლადიმერ ვახანიას ამომრჩეველთა საინიციატივო ჯგუფი": {
      name: "ვლადიმერ ვახანიას ამომრჩეველთა საინიციატივო ჯგუფი",
      short: "Vladimir Vakhania's Voters' Initiative Group",
      code: "VLADIMIRVAKHANIA",
      color: "#ff0009",
    },
    "მომავალი დღეს": {
      name: "მომავალი დღეს",
      short: "Future Today",
      code: "FUTURETODAY",
      color: "#313019",
    },
    "მოძრაობა ამომრჩეველთა ლიგა": {
      name: "მოძრაობა ამომრჩეველთა ლიგა",
      short: "League of Voters Movement",
      code: "VOTERSLEAGUE",
      color: "#ff0011",
    },
    "ზვიად ჩიტიშვილის ამომრჩეველთა საინიციატივო ჯგუფი": {
      name: "ზვიად ჩიტიშვილის ამომრჩეველთა საინიციატივო ჯგუფი",
      short: "Zviad Chitishvili's Voters' Initiative Group",
      code: "ZVIADCHITISHVILI",
      color: "#ff0012",
    },
    "საქართველოს ევროპელი დემოკრატები": {
      name: "საქართველოს ევროპელი დემოკრატები",
      short: "European Democrats of Georgia",
      code: "EUDEMOCRATS",
      color: "#2a0e72",
    },
    "საქართველოს გზა": {
      name: "საქართველოს გზა",
      short: "The Way of Georgia",
      code: "WAYOFGEORGIA",
      wiki: 6488526,
      color: "#fad300",
    },
    "ალექსანდრე ელისაშვილი დამოუკიდებელი კანდიდატი": {
      name: "ალექსანდრე ელისაშვილი დამოუკიდებელი კანდიდატი",
      short: "Aleksandre Elisashvili Independent candidate",
      code: "ALEXANDREELISASHVILI",
      color: "#ff0015",
    },
    "დევნილთა პარტია": {
      name: "დევნილთა პარტია",
      short: "Party of IDPs",
      code: "PARTYOFIDPS",
      color: "#ff0016",
    },
    "ახალი პოლიტიკური ცენტრისთვის (პლატფორმა)": {
      name: "ახალი პოლიტიკური ცენტრისთვის (პლატფორმა)",
      short: "For a New Political Center (Platform)",
      code: "NEWPOLITICALCENTER",
      color: "#ff0017",
    },
    "გაერთიანება ბედნიერი საქართველოსთვის": {
      name: "გაერთიანება ბედნიერი საქართველოსთვის",
      short: "Unity for a Happy Georgia",
      code: "HAPPYGEORGIA",
      color: "#ff0018",
    },
    "მოძრაობა-სახელმწიფო ხალხისთვის (პლატფორმა)": {
      name: "მოძრაობა-სახელმწიფო ხალხისთვის (პლატფორმა)",
      short: "Movement-State for the People (Platform)",
      code: "MOVEMENTSTATE",
      color: "#ff0019",
    },
    "ჩვენი სამშობლო": {
      name: "ჩვენი სამშობლო",
      short: "Our Homeland",
      code: "OURHOMELAND",
      color: "#ff0020",
    },
    "წარმატებული საქართველო": {
      name: "წარმატებული საქართველო",
      short: "Successful Georgia",
      code: "SUCCESSFULGEORGIA",
      color: "#ff0021",
    },
    "ახალი პოლიტიკური ცენტრი - გირჩი": {
      name: "ახალი პოლიტიკური ცენტრი - გირჩი",
      short: "New Political Centre – Girchi",
      code: "NPCGIRCHI",
      color: "#00A54A",
      wiki: 49382816,
    },
    "ირაკლი შიხიაშვილი დამოუკიდებელი კანდიდატი": {
      name: "ირაკლი შიხიაშვილი დამოუკიდებელი კანდიდატი",
      short: "Irakli Shikhiashvili Independent candidate",
      code: "IRAKLISHIKHIASHVILI",
      color: "#ff0023",
    },
    "ილია კოკაია დამოუკიდებელი კანდიდატი": {
      name: "ილია კოკაია დამოუკიდებელი კანდიდატი",
      short: "Ilia Kokaia Independent Candidate",
      code: "ILIAKOKAIA",
      color: "#ff0024",
    },
    "სალომე ზურაბიშვილი დამოუკიდებელი კანდიდატი": {
      name: "სალომე ზურაბიშვილი დამოუკიდებელი კანდიდატი",
      short: "Salome Zurabishvili Independent candidate",
      code: "SALOMEZURABISHVILI",
      color: "#ff0025",
    },
    "ცეზარ ჩოჩელი დამოუკიდებელი კანდიდატი": {
      name: "ცეზარ ჩოჩელი დამოუკიდებელი კანდიდატი",
      short: "Cesar Chocheli Independent Candidate",
      code: "CESARCHOCHELI",
      color: "#ff0026",
    },
    "დავით ჭანტურია დამოუკიდებელი კანდიდატი": {
      name: "დავით ჭანტურია დამოუკიდებელი კანდიდატი",
      short: "Davit Chanturia is an independent candidate.",
      code: "DAVITCHANTURIA",
      color: "#ff0027",
    },
    "ვასილ ხანიშვილი დამოუკიდებელი კანდიდატი": {
      name: "ვასილ ხანიშვილი დამოუკიდებელი კანდიდატი",
      short: "Vasil Khanishvili Independent candidate",
      code: "VASILKHANISHVILI",
      color: "#ff0028",
    },
    "კასპის მომავლის ფონდი": {
      name: "კასპის მომავლის ფონდი",
      short: "Kaspi Future Foundation",
      code: "KASPI",
      color: "#ff0029",
    },
    "ქობულეთის მომავლის ფონდი": {
      name: "ქობულეთის მომავლის ფონდი",
      short: "Kobuleti Future Fund",
      code: "KOBULETI",
      color: "#ff0030",
    },
    სამართლიანობისთვის: {
      name: "სამართლიანობისთვის",
      short: "For Justice",
      code: "FORJUSTICE",
      color: "#008c45",
    },
    "მოქალაეთა პოლიტიკური გაერთიანება ალეკო ელისაშვილი - მოქალაქეები": {
      name: "მოქალაეთა პოლიტიკური გაერთიანება ალეკო ელისაშვილი - მოქალაქეები",
      short: "Citizens' Political Union Aleko Elisashvili - Citizens",
      code: "CITIZENS",
      color: "#ff0032",
    },
    "ეროვნულ-დემოკრატიული მოძრაობა": {
      name: "ეროვნულ-დემოკრატიული მოძრაობა",
      short: "National Democratic Movement",
      code: "NDM",
      color: "#ff0033",
    },
    "თავისუფლების მოედანი": {
      name: "თავისუფლების მოედანი",
      short: "Freedom Square",
      code: "FREEDOMSQUARE",
      color: "#118dc0",
      wiki: 77676113,
    },
    "ერთიანი ნეიტრალური საქართველო": {
      name: "ერთიანი ნეიტრალური საქართველო",
      short: "United Neutral Georgia",
      code: "UNITEDNEUTRAL",
      color: "#003166",
    },
  };

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.json`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const allData: GeJsonItem[] = [];
    let start = 0;
    const length = 5000;
    let recordsTotal = 0;
    let draw = 1;

    do {
      const url = new URL("https://monitoring.sao.ge/ka/donations");
      url.searchParams.set("l", "0");
      url.searchParams.set("y", year);
      url.searchParams.set("draw", String(draw++));
      url.searchParams.set("start", String(start));
      url.searchParams.set("length", String(length));
      url.searchParams.set("_", String(Date.now()));

      // Add column parameters as expected by DataTables
      const columns = [
        "politician.name",
        "date",
        "donor.person_name",
        "donor.person_id",
        "verified_amount",
        "donor.legal_form",
        "form_id",
        "donor.person_surname",
        "donor.legal_name",
        "donor.legal_id",
      ];

      columns.forEach((col, idx) => {
        url.searchParams.set(`columns[${idx}][data]`, col);
        url.searchParams.set(`columns[${idx}][name]`, col);
        url.searchParams.set(`columns[${idx}][searchable]`, "true");
        url.searchParams.set(`columns[${idx}][orderable]`, "true");
        url.searchParams.set(`columns[${idx}][search][value]`, "");
        url.searchParams.set(`columns[${idx}][search][regex]`, "false");
      });

      url.searchParams.set("order[0][column]", "1");
      url.searchParams.set("order[0][dir]", "desc");
      url.searchParams.set("search[value]", "");
      url.searchParams.set("search[regex]", "false");

      this.log(
        `Loading year ${year} data from ${url.toString()} (start: ${start})`,
      );

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch data from ${url.toString()}: ${res.statusText}`,
        );
      }

      const json = (await res.json()) as GeJsonResponse;

      if (!json.data || !Array.isArray(json.data)) {
        throw new Error(`Invalid JSON response from ${url.toString()}`);
      }

      allData.push(...json.data);
      recordsTotal = json.recordsTotal;
      start += length;

      this.log(`Fetched ${allData.length} / ${recordsTotal} items`);
    } while (start < recordsTotal);

    await fs.writeFile(this.cacheFile(year), JSON.stringify(allData, null, 2));
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const content = await this.cachedYearData(year);
    if (!content) return [];

    const items = JSON.parse(content) as GeJsonItem[];

    return items
      .map((item, idx) => {
        // we only care about #10 - Monetary donations and #16 - Monetary donations made by legal entities
        if (
          !(
            item.form_id === "#10 - ფულადი შემოწირულებები" ||
            item.form_id ===
              "#16 - იურიდიული პირის მიერ განხორციელებული ფულადი შემოწირულებები"
          )
        )
          return;

        const date = toIsoDate(item.date);
        if (!date.startsWith(year)) return;

        const amount = parseFloat(item.amount);

        return {
          idx: `r${idx}`,
          [DonationField.Date]: date,
          [DonationField.Amount]: amount,
          [DonationField.DonorName]: item.donor.name.trim(),
          [DonationField.Address]: {
            [AddressField.Country]: "GE" as Countries,
          },
          [DonationField.Receiver]: item.politician.name.trim() as ReceiverId,
          [DonationField.DonorType]: legalFormMappings[item.donor.legal_form],
        };
      })
      .filter(isNotNullandNotUndefined);
  }
}

// convert DD/MM/YYYY to YYYY-MM-DD
const toIsoDate = (date: string): string => {
  const parts = date.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  // Fallback for old format if it still exists
  const [datePart] = date.split(" ");
  return datePart;
};
