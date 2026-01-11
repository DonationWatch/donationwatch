import { notFound } from "next/navigation";

import { Article, ArticleSection } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";
import { getTranslations } from "../translations";

import type En from "../../../messages/en";
import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const enum CountryNote {
  PDF_ONLY = "pdf",
  SWEDEN = "sweden",
  GERMANY = "germany",
}

const componentTranslations = {
  en: {
    p0: `We aim to integrate donation data for all countries where the data is available in a machine-readable format.
Most formats work for us, including JSON, CSV, HTML tables, and XML.
The main obstacle is PDF, which often contains scanned images rather than extractable text.
Converting these PDFs into structured data typically requires substantial manual effort.`,
    h1: `Countries we currently don't track`,
    p1: `We currently do not track some countries because their published data cannot be reliably parsed due to format limitations.
Based on our initial review, Italy, Slovenia, and Bosnia and Herzegovina may be easier to integrate because their PDFs appear relatively well structured.`,
    p2: `We’re continuously expanding our coverage. If you know of additional countries that publish political donation data in any form, please contact us and share a link or source. An informed list of countries (even when the data is only available as PDFs or on web pages) is helpful both for us to prioritize future integrations and for anyone interested in finding and comparing this information across countries:`,
    notes: {
      [CountryNote.PDF_ONLY]: "PDF files only",
      [CountryNote.SWEDEN]:
        "Donations are only published in sum with no individual donation data",
      [CountryNote.GERMANY]:
        "Donations between 10k and 35k are published as PDF scans",
    },
    table: {
      country: "Country",
      notes: "Notes",
      source: "Source",
    },
  },
  de: {
    p0: `Wir möchten Spenden-Daten für alle Länder integrieren, in denen die Daten in einem maschinenlesbaren Format verfügbar sind.
Die meisten Formate funktionieren für uns, darunter JSON, CSV, HTML-Tabellen und XML.
Das größte Hindernis sind PDFs, die häufig gescannte Bilder statt extrahierbarem Text enthalten.
Die Umwandlung dieser PDFs in strukturierte Daten erfordert in der Regel erheblichen manuellen Aufwand.`,
    h1: `Länder, die wir derzeit nicht verfolgen`,
    p1: `Einige Länder verfolgen wir derzeit nicht, weil sich ihre veröffentlichten Daten aufgrund von Formatbeschränkungen nicht zuverlässig parsen lassen.
Basierend auf unserer ersten Prüfung könnten Italien, Slowenien sowie Bosnien und Herzegowina leichter zu integrieren sein, da ihre PDFs relativ gut strukturiert wirken.`,
    p2: `Wir erweitern unsere Abdeckung kontinuierlich. Wenn Sie von weiteren Ländern wissen, die politische Spendendaten in irgendeiner Form veröffentlichen, kontaktieren Sie uns bitte und teilen Sie einen Link oder eine Quelle. Eine gut informierte Länderliste (auch wenn die Daten nur als PDFs oder auf Webseiten verfügbar sind) hilft uns sowohl dabei, zukünftige Integrationen zu priorisieren, als auch allen, die daran interessiert sind, diese Informationen länderübergreifend zu finden und zu vergleichen:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Nur PDF-Dateien",
      [CountryNote.SWEDEN]:
        "Spenden werden nur als Gesamtsumme veröffentlicht, ohne Daten zu einzelnen Spenden",
      [CountryNote.GERMANY]:
        "Spenden zwischen 10k und 35k werden als eingescannte PDFs veröffentlicht",
    },
    table: {
      country: "Land",
      notes: "Hinweise",
      source: "Quelle",
    },
  },
  cs: {
    p0: `Naším cílem je integrovat data o darech pro všechny země, kde jsou data dostupná ve strojově čitelném formátu.
Většina formátů nám vyhovuje, včetně JSON, CSV, HTML tabulek a XML.
Hlavní překážkou jsou PDF, která často obsahují naskenované obrázky místo extrahovatelného textu.
Převod těchto PDF do strukturovaných dat obvykle vyžaduje značné množství ruční práce.`,
    h1: `Země, které aktuálně nesledujeme`,
    p1: `Některé země v současnosti nesledujeme, protože jejich publikovaná data nelze kvůli omezením formátu spolehlivě parsovat.
Na základě naší úvodní kontroly se zdá, že Itálie, Slovinsko a Bosna a Hercegovina mohou být jednodušší k integraci, protože jejich PDF vypadají relativně dobře strukturovaná.`,
    p2: `Naše pokrytí průběžně rozšiřujeme. Pokud víte o dalších zemích, které v jakékoli formě zveřejňují údaje o politických darech, kontaktujte nás prosím a sdílejte odkaz nebo zdroj. Informovaný seznam zemí (i když jsou data dostupná pouze jako PDF nebo na webových stránkách) je užitečný jak pro nás při určování priorit budoucích integrací, tak pro každého, kdo má zájem tyto informace napříč zeměmi vyhledávat a porovnávat:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Pouze soubory PDF",
      [CountryNote.SWEDEN]:
        "Donace jsou zveřejňovány pouze jako souhrnná částka, bez údajů o jednotlivých darech",
      [CountryNote.GERMANY]:
        "Donace mezi 10k a 35k jsou zveřejňovány jako naskenované PDF",
    },
    table: {
      country: "Země",
      notes: "Poznámky",
      source: "Zdroj",
    },
  },
  nl: {
    p0: `We willen donatiegegevens integreren voor alle landen waar de gegevens beschikbaar zijn in een machineleesbaar formaat.
De meeste formaten werken voor ons, waaronder JSON, CSV, HTML-tabellen en XML.
Het grootste obstakel is PDF, dat vaak gescande afbeeldingen bevat in plaats van extraheerbare tekst.
Het omzetten van deze PDF's naar gestructureerde data vereist doorgaans aanzienlijke handmatige inspanning.`,
    h1: `Landen die we momenteel niet volgen`,
    p1: `We volgen sommige landen momenteel niet, omdat hun gepubliceerde data door formaatbeperkingen niet betrouwbaar te parseren is.
Op basis van onze eerste beoordeling lijken Italië, Slovenië en Bosnië en Herzegovina mogelijk eenvoudiger te integreren, omdat hun PDF's relatief goed gestructureerd lijken.`,
    p2: `We breiden onze dekking voortdurend uit. Als je weet van aanvullende landen die in welke vorm dan ook gegevens over politieke donaties publiceren, neem dan contact met ons op en deel een link of bron. Een goed onderbouwde landenlijst (ook wanneer de gegevens alleen beschikbaar zijn als pdf’s of op webpagina’s) helpt ons zowel om toekomstige integraties te prioriteren als iedereen die geïnteresseerd is in het vinden en vergelijken van deze informatie tussen landen:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Alleen PDF-bestanden",
      [CountryNote.SWEDEN]:
        "Donaties worden alleen als totaalsom gepubliceerd, zonder individuele donatiegegevens",
      [CountryNote.GERMANY]:
        "Donaties tussen 10k en 35k worden gepubliceerd als gescande PDF's",
    },
    table: {
      country: "Land",
      notes: "Opmerkingen",
      source: "Bron",
    },
  },
  lv: {
    p0: `Mūsu mērķis ir integrēt ziedojumu datus visām valstīm, kur šie dati ir pieejami mašīnlasāmā formātā.
Lielākā daļa formātu mums der, tostarp JSON, CSV, HTML tabulas un XML.
Galvenais šķērslis ir PDF, kuros bieži ir ieskenēti attēli, nevis izvelkams teksts.
Šo PDF pārveidošana strukturētos datos parasti prasa ievērojamu manuālu darbu.`,
    h1: `Valstis, kuras pašlaik neizsekojam`,
    p1: `Pašlaik mēs neizsekojam dažas valstis, jo to publicētos datus formāta ierobežojumu dēļ nevar uzticami parsēt.
Balstoties uz mūsu sākotnējo izvērtējumu, Itāliju, Slovēniju un Bosniju un Hercegovinu varētu būt vieglāk integrēt, jo to PDF šķiet salīdzinoši labi strukturēti.`,
    p2: `Mēs nepārtraukti paplašinām mūsu pārklājumu. Ja zināt par papildu valstīm, kas jebkādā formā publicē politisko ziedojumu datus, lūdzu, sazinieties ar mums un kopīgojiet saiti vai avotu. Labi informēts valstu saraksts (pat ja dati ir pieejami tikai PDF formātā vai tīmekļa lapās) ir noderīgs gan mums, lai noteiktu prioritātes turpmākajām integrācijām, gan ikvienam, kurš vēlas atrast un salīdzināt šo informāciju starp valstīm:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Tikai PDF faili",
      [CountryNote.SWEDEN]:
        "Ziedojumi tiek publicēti tikai kā kopsumma, bez individuālu ziedojumu datiem",
      [CountryNote.GERMANY]:
        "Ziedojumi no 10k līdz 35k tiek publicēti kā ieskenēti PDF",
    },
    table: {
      country: "Valsts",
      notes: "Piezīmes",
      source: "Avots",
    },
  },
  et: {
    p0: `Meie eesmärk on integreerida annetuste andmed kõigi riikide kohta, kus andmed on masinloetavas vormingus kättesaadavad.
Enamik vorminguid sobib meile, sh JSON, CSV, HTML-tabelid ja XML.
Peamine takistus on PDF, mis sisaldab sageli skaneeritud pilte, mitte väljavõetavat teksti.
Nende PDF-ide teisendamine struktureeritud andmeteks nõuab tavaliselt märkimisväärset käsitsi tööd.`,
    h1: `Riigid, mida me praegu ei jälgi`,
    p1: `Praegu me ei jälgi mõningaid riike, sest nende avaldatud andmeid ei saa vormingupiirangute tõttu usaldusväärselt parsida.
Meie esialgse ülevaatuse põhjal võivad Itaalia, Sloveenia ning Bosnia ja Hertsegoviina olla lihtsamini integreeritavad, sest nende PDF-id näivad olevat suhteliselt hästi struktureeritud.`,
    p2: `Laiendame oma katvust pidevalt. Kui teate täiendavaid riike, mis avaldavad poliitiliste annetuste andmeid mis tahes kujul, võtke palun meiega ühendust ning jagage linki või allikat. Hästi informeeritud riikide loend (isegi siis, kui andmed on kättesaadavad ainult PDF-idena või veebilehtedel) on abiks nii meil tulevaste integratsioonide prioriseerimisel kui ka kõigile, kes soovivad seda teavet riikide lõikes leida ja võrrelda:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Ainult PDF-failid",
      [CountryNote.SWEDEN]:
        "Annetused avaldatakse ainult kogusummana, ilma üksikannetusandmeteta",
      [CountryNote.GERMANY]:
        "10k–35k vahemikus annetused avaldatakse skaneeritud PDF-idena",
    },
    table: {
      country: "Riik",
      notes: "Märkused",
      source: "Allikas",
    },
  },
  hr: {
    p0: `Cilj nam je integrirati podatke o donacijama za sve zemlje u kojima su podaci dostupni u strojno čitljivom formatu.
Većina formata nam odgovara, uključujući JSON, CSV, HTML tablice i XML.
Glavna prepreka je PDF, koji često sadrži skenirane slike umjesto teksta koji se može izvući.
Pretvaranje tih PDF-ova u strukturirane podatke obično zahtijeva znatan ručni napor.`,
    h1: `Zemlje koje trenutačno ne pratimo`,
    p1: `Trenutačno ne pratimo neke zemlje jer se njihovi objavljeni podaci zbog ograničenja formata ne mogu pouzdano parsirati.
Na temelju našeg početnog pregleda, Italiju, Sloveniju te Bosnu i Hercegovinu možda je lakše integrirati jer njihovi PDF-ovi djeluju relativno dobro strukturirani.`,
    p2: `Kontinuirano proširujemo našu pokrivenost. Ako znate za dodatne zemlje koje u bilo kojem obliku objavljuju podatke o političkim donacijama, kontaktirajte nas i podijelite poveznicu ili izvor. Dobro informiran popis zemalja (čak i kada su podaci dostupni samo kao PDF-ovi ili na web-stranicama) koristan je i nama za određivanje prioriteta budućih integracija i svima koji su zainteresirani pronaći i usporediti te informacije među zemljama:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Samo PDF datoteke",
      [CountryNote.SWEDEN]:
        "Donacije se objavljuju samo kao ukupni iznos, bez podataka o pojedinačnim donacijama",
      [CountryNote.GERMANY]:
        "Donacije između 10k i 35k objavljuju se kao skenirani PDF-ovi",
    },
    table: {
      country: "Zemlja",
      notes: "Napomene",
      source: "Izvor",
    },
  },
  no: {
    p0: `Vi har som mål å integrere donasjonsdata for alle land der dataene er tilgjengelige i et maskinlesbart format.
De fleste formater fungerer for oss, inkludert JSON, CSV, HTML-tabeller og XML.
Den største hindringen er PDF, som ofte inneholder skannede bilder i stedet for tekst som kan hentes ut.
Å konvertere disse PDF-ene til strukturerte data krever vanligvis betydelig manuelt arbeid.`,
    h1: `Land vi for øyeblikket ikke sporer`,
    p1: `Vi sporer for øyeblikket ikke enkelte land fordi de publiserte dataene deres ikke kan parses pålitelig på grunn av formatbegrensninger.
Basert på vår innledende gjennomgang kan Italia, Slovenia og Bosnia-Hercegovina være enklere å integrere, fordi PDF-ene deres ser ut til å være relativt godt strukturerte.`,
    p2: `Vi utvider dekningen vår kontinuerlig. Hvis du kjenner til flere land som publiserer data om politiske donasjoner i en eller annen form, ta kontakt med oss og del en lenke eller kilde. En oppdatert liste over land (selv når dataene bare er tilgjengelige som PDF-er eller på nettsider) er nyttig både for oss når vi prioriterer fremtidige integrasjoner, og for alle som er interessert i å finne og sammenligne denne informasjonen på tvers av land:`,
    notes: {
      [CountryNote.PDF_ONLY]: "Kun PDF-filer",
      [CountryNote.SWEDEN]:
        "Donasjoner publiseres kun som en totalsum, uten data om individuelle donasjoner",
      [CountryNote.GERMANY]:
        "Donasjoner mellom 10k og 35k publiseres som skannede PDF-er",
    },
    table: {
      country: "Land",
      notes: "Merknader",
      source: "Kilde",
    },
  },
} as const;

const sources: {
  country: keyof typeof En.countries;
  note: CountryNote;
  source: { name: string; url: string };
}[] = [
  {
    country: "DE",
    note: CountryNote.GERMANY,
    source: {
      name: "Bundestag",
      url: "https://www.bundestag.de/parlament/praesidium/parteienfinanzierung/rechenschaftsberichte",
    },
  },
  {
    country: "NZ",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Electoral Commission",
      url: "https://elections.nz/democracy-in-nz/political-parties-in-new-zealand/party-donations-and-loans-by-year/",
    },
  },
  {
    country: "FI",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Valtiontalouden tarkastusvirasto",
      url: "https://www.vaalirahoitusvalvonta.fi/fi/index/puoluerahoitus/Puoluerahoitusvalvonnanilmoitukset/tilinpaatostiedot.html",
    },
  },
  {
    country: "SE",
    note: CountryNote.SWEDEN,
    source: {
      name: "Kammarkollegiet",
      url: "https://www.kammarkollegiet.se/vara-tjanster/insyn-i-partiers-finansiering/hitta-statistik-pa-redovisade-intakter/intaktsredovisningar-politiska-aktorer-2018-och-framat",
    },
  },
  {
    country: "IT",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "PARLAMENTO ITALIANO",
      url: "https://parlamento18.camera.it/199",
    },
  },
  {
    country: "RO",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Autoritatea Electorală Permanentă",
      url: "https://finantarepartide.ro/partidul-pro-romania-pro-romania/",
    },
  },
  {
    country: "GR",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Βουλή των Ελλήνων",
      url: "https://epitropielegxou.parliament.gr/%CE%9F%CE%B9%CE%BA%CE%BF%CE%BD%CE%BF%CE%BC%CE%B9%CE%BA%CE%AC-%CE%A3%CF%84%CE%BF%CE%B9%CF%87%CE%B5%CE%AF%CE%B1/%CE%9A%CE%BF%CE%BC%CE%BC%CE%AC%CF%84%CF%89%CE%BD/%CE%A0%CF%81%CE%BF%CF%8B%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CE%BC%CE%BF%CE%AF-%CE%91%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CE%BC%CE%BF%CE%AF-%CE%99%CF%83%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CE%BC%CE%BF%CE%AF",
    },
  },
  {
    country: "BA",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Izbori u Bosni i Hercegovini",
      url: "https://www.izbori.ba/Default.aspx?CategoryID=60&Lang=3&Mod=4",
    },
  },
  {
    country: "SI",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "AJPES",
      url: "https://www.ajpes.si/jolp/default.asp",
    },
  },
  {
    country: "ZA",
    note: CountryNote.PDF_ONLY,
    source: {
      name: "Electoral Commission of South Africa (IEC)",
      url: "https://www.elections.org.za/pw/Downloads/Documents-Library-Annual-Reports-IEC",
    },
  },
];

export async function generateMetadata(
  props: PageProps<"/[locale]/other-countries">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  const { locale } = params;

  const translations = await getTranslations(locale);

  return {
    title: `${translations.other_countries.title} | DonationWatch`,
    alternates: generateAlternates("imprint"),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/other-countries">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  const { locale } = params;

  const pageTranslations = componentTranslations[locale];
  const translations = await getTranslations(locale);

  return (
    <NonCountryRootLayout locale={locale} translations={translations}>
      <Article
        title={translations.other_countries.title}
        subtitle={pageTranslations.p0}
      >
        <ArticleSection title={pageTranslations.h1}>
          {pageTranslations.p1}

          <div className="prose dark:prose-invert w-full max-w-full pt-6">
            <table>
              <thead>
                <tr>
                  <th>{pageTranslations.table.country}</th>
                  <th>{pageTranslations.table.notes}</th>
                  <th>{pageTranslations.table.source}</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.country}>
                    <td>
                      {
                        translations.countries[
                          source.country as keyof typeof En.countries
                        ]
                      }
                    </td>
                    <td>{pageTranslations.notes[source.note]}</td>
                    <td>
                      <a
                        href={source.source.url}
                        rel="nofollow noopener noreferrer"
                        target="_blank"
                      >
                        {source.source.name}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>{pageTranslations.p2}</p>

          <a
            href={`mailto:${CONTACT_MAIL}`}
            className="text-primary-700 dark:text-primary-400 hover:underline"
          >
            {CONTACT_MAIL}
          </a>
        </ArticleSection>
      </Article>
    </NonCountryRootLayout>
  );
}
