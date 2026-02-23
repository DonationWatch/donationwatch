/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";

import { parse } from "csv-parse/sync";

import { isNotNullandNotUndefined } from "../../../src/utils/array";
import { Country } from "../../../src/utils/countries";
import {
  AddressField,
  DonationField,
  DonorType,
} from "../../../src/utils/types";
import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";

import type { Countries } from "../../../src/utils/countries";
import type { ReceiverId } from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";
import type { ReadableStream } from "stream/web";

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

type GeRow = [
  donationRecipient: string,
  date: string,
  nameTitle: string,
  numberCode: string,
  amount: `${number}`,
  legalForm: GeLegalForm,
  donationType: GeDonationType,
];

export class GeLoader extends DataLoader {
  private loadedOnce = false;

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
  };

  donorMeta = donorMeta;

  cacheFile() {
    return path.join(this.cacheDir, `donations.csv`);
  }

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const url =
      "https://monitoring.acb.gov.ge/ka/donations?draw=1&columns%5B0%5D%5Bdata%5D=politician.name&columns%5B0%5D%5Bname%5D=politician.name&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=date&columns%5B1%5D%5Bname%5D=date&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=donor.name&columns%5B2%5D%5Bname%5D=donor.person_name&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=donor.number&columns%5B3%5D%5Bname%5D=donor.person_id&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=verified_amount&columns%5B4%5D%5Bname%5D=verified_amount&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=donor.legal_form&columns%5B5%5D%5Bname%5D=donor.legal_form&columns%5B5%5D%5Bsearchable%5D=false&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=form_id&columns%5B6%5D%5Bname%5D=form_id&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=donor.name&columns%5B7%5D%5Bname%5D=donor.person_surname&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=donor.name&columns%5B8%5D%5Bname%5D=donor.legal_name&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=donor.number&columns%5B9%5D%5Bname%5D=donor.legal_id&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=1&order%5B0%5D%5Bdir%5D=desc&start=0&length=25&search%5Bvalue%5D=&search%5Bregex%5D=false&action=csv&l=0";
    this.log(`Loading year data from ${url}`);
    const res = await fetch(url);

    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    await finished(
      Readable.fromWeb(res.body as unknown as ReadableStream<Uint8Array>).pipe(
        fs.createWriteStream(this.cacheFile()),
      ),
    );
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const csv = await this.cachedYearData(year);
    const rows = parse(csv, {
      bom: true,
      fromLine: 2,
      skip_empty_lines: true,
      columns: false,
    }) as GeRow[];

    return rows
      .map((row, idx) => {
        const [
          donationRecipient,
          date,
          nameTitle,
          numberCode,
          amount,
          legalForm,
          donationType,
        ] = row;

        // we only care about #10 - Monetary donations and #16 - Monetary donations made by legal entities
        if (
          !(
            donationType === "#10 - ფულადი შემოწირულებები" ||
            donationType ===
              "#16 - იურიდიული პირის მიერ განხორციელებული ფულადი შემოწირულებები"
          )
        )
          return;

        if (!date.startsWith(year)) return;

        const floatAmount = parseFloat(amount);

        return {
          idx: `r${idx}`,
          [DonationField.Date]: toIsoDate(date),
          [DonationField.Amount]: floatAmount,
          [DonationField.DonorName]: nameTitle,
          [DonationField.Address]: {
            [AddressField.Country]: "GE" as Countries,
          },
          [DonationField.Receiver]: donationRecipient as ReceiverId,
          [DonationField.DonorType]: legalFormMappings[legalForm],
        };
      })
      .filter(isNotNullandNotUndefined);
  }
}

// convert 2025-10-03 00:00:00 to iso8601
const toIsoDate = (date: string): string => {
  const [datePart] = date.split(" ");
  return datePart;
};
