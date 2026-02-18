import { DonorType } from "../utils/types";

const Et = {
  copyright: "Autoriõigus",
  charts_license:
    "Diagrammid on litsentsitud {license} koos autorluse märkimisega",
  data_error: "Andmeid ei saanud laadida",
  description:
    "DonationWatch annab selge ülevaate annetajatest ja erakondadest, lihtsustades poliitilise rahastamise mõistmist, selgitades keerulisi andmeid lihtsas keeles.",
  title: "Partei annetused {country}",
  sum: "Kokku",
  donation_count: "Annetuste arv",
  average: "keskmine",
  donations_by_party: "Annetused osapoolte kaupa",
  donations_per_year: "Annetused aastas",
  party_donations: "Partei annetused",
  more: "Rohkem",
  loading: "Sisu on laaditud",
  data_since: "Alates {year}. aastast",
  view_party: "Vaadake {party} partei lehekülge",
  faq: "Korduma kippuvad küsimused",
  sidebar: {
    toggle: "Lülita külgriba",
    donations: "Annetused",
    all_countries: "Kõik riigid",
    tools: "Tööriistad",
    show_all: "Kuva kõik ({num})",
    show_less: "Kuva vähem",
  },
  search: {
    filter: "Otsi...",
    filter_description: "Erakondade, aastate või doonorite otsing",
    parties: "Pooled",
    years: "Aastat",
    legislative_years: "Seadusandlikud aastad",
    empty: "Tulemusi ei leitud",
    donors: "Doonorid",
  },
  page_title: {
    years: {
      description:
        "Aastal {year} said {parties} parteid riigis {country} kokku {sum} {count} annetusest, mis ületasid {minAmount}. Uurige üksikasjalikke jaotusi parteide, annetajate ja poliitilise rahastamise trendide lõikes.",
      overview:
        "Ülevaade poliitiliste parteide annetustest {country} aastal {year}",
      changes:
        "Viimased muudatused poliitiliste parteide annetustes {country} aastal {year}",
      donors:
        "Suurimad annetajad poliitilistele parteidele {country} aastal {year}",
      timeline:
        "Ajaline joon poliitiliste parteide annetustest {country} aastal {year}",
      origin:
        "Geograafiline ülevaade parteiannetustest {country} aastal {year}",
    },
    party: {
      donors: "{party} suurimad annetajad {country}",
      changes: "{party} annetuste viimased muudatused {country}",
      timeline: "{party} parteiannetuste ajajoon {country}",
      origin: "{party} parteiannetuste geograafiline ülevaade {country}",
      description:
        "Alates {year} on {party} saanud kokku {count} annetust, mis ületavad {minimumAmount}, kogusummas {sum}. Uurige üksikasjalikku teavet suurannetajate ja annetuste trendide kohta {party} jaoks riigis {country}.",
    },
    donor: {
      overview: "{donor} annetused {country}s",
      description:
        "{donor} on annetanud kokku {sum} {count} annetuses, millest igaüks ületas {minAmount} alates {minYear}. Need annetused jagati {parties} erineva partei vahel. Uurige üksikasjalikke andmeid selle annetaja annetuste mustrite ja saajaparteide kohta riigis {country}.",
    },
  },
  chart: {
    save_as_image: "Salvesta pildina",
    toggle_fullscreen: "Üleminek täisekraani režiimi",
    reset_zoom: "Zoomi lähtestamine",
  },
  over_min_public_amount: "üle {amount}",
  over_threshold: "ainult erakonnad, millel on ≥ {count} annetusi või ≥ {sum}",
  prelim_data: "esialgsed andmed alates {year}. aastast",
  excludes_year_only_donations:
    "välistab annetused, mille kuupäevaks on ainult aasta",
  common: {
    date: "kuupäev",
    party: "Partei",
    donor: "Doonor",
    amount: "Summa",
    anonymizedDonor: "Anonümiseeritud annetaja",
    redactedDonor: "Varjatud annetaja",
  },
  sort: {
    asc: "Sorteerimine ülespoole",
    desc: "Sorteerimine kahanevas järjestuses",
    clear: "Tühista sorteerimine",
  },
  footer: {
    sources: "Allikad",
    build: "Seisund {date}",
    build_since: "Alates {date}, aastast {year}",
    published_by: "Nagu avaldanud {source}",
  },
  header: {
    home: "Koduleht",
    language_selection: "Keele valik",
    country_selection: "Riigi valik",
  },
  actions: {
    close: "Sulge",
    play: "Esita",
    pause: "Paus",
    restart: "Taaskäivita",
  },
  donor_dialog: {
    title: "Doonori andmed",
    summary: "Kokkuvõte",
  },
  donation_dialog: {
    title: "Annetuse üksikasjad",
    donor: "Doonor",
    country: "Riik",
    state: "Liitvabariigi",
    receiver: "Vastuvõtja",
    donation_amount: "Annetuse summa",
    date: "kuupäev",
  },
  root: {
    title: "Avatud lähtekoodiga poliitiliste parteide annetuste jälgija",
    subtitle:
      "Jälgi ja uuri poliitilisi annetusi mitmes riigis. Mõista, kes rahastab poliitilisi parteisid ja kuidas raha üle maailma liigub.",
    stats: {
      countries: "Kaasatud riigid",
      parties: "Poliitilised parteid",
      donations: "Individuaalsed annetused",
      currencies: "Jälgitavad valuutad",
    },
    countries: {
      title: "Uuri poliitilisi annetusi riigiti",
      subtitle:
        "Vali riik, et pääseda ligi üksikasjalikele annetuskirjetele, parteide rahastamise andmetele ja annetajate teabele.",
    },
    why: {
      title: "Miks poliitiliste annetuste läbipaistvus on oluline",
      p0: "Demokraatia sõltub teadlikest kodanikest. Muutes poliitiliste annetuste andmed kättesaadavaks ja hõlpsasti uuritavaks, aitame inimestel mõista rahalisi seoseid, mis kujundavad nende poliitilist maastikku. Läbipaistvus poliitilises rahastamises suurendab usaldust, tugevdab vastutust ning annab valijatele võimaluse teha teadlikke otsuseid.",
    },
    open_source: {
      title: "Avatud lähtekood",
      p0: "DonationWatch on avatud lähtekoodiga. Saad koodi vaadata, probleemidest teatada või panustada {github} kaudu.",
    },
  },
  home: {
    most_recent: "Viimased annetused",
    hero: {
      subtitle: "{country} erakondade annetuste jälgimine",
      subtitle_no_country: "Poliitiliste parteide annetuste jälgimine",
    },
    biggest_donations: {
      text: "Alates {minYear} on {country} suurim avalikustatud üksikannetus ulatunud {amount}, mille andis {donor} parteile {party} aastal {year}. Sellele järgnevad {others}.",
      list: "{amount} annetajalt {donor} saajale {receiver}",
    },
    last_period: "Kõige hiljutisem aasta:",
    previous_period: "Eelmise aasta annetused.",
    what: {
      title: "Mis see on?",
      summary:
        "Erakondade annetused on oluline osa poliitikast. Need on oluline poliitilise toetuse näitaja.\n" +
        "\n" +
        "Me püüame neid andmeid selgelt ja arusaadavalt esitada.",
      threshold:
        "Tulenevalt väiksemate erakondade suurest arvust jälgime annetusi ainult nendele erakondadele, mis vastavad kindlale künnisele. Praegune künnis on määratud {count} annetusega või kogusummaga {sum}, mis on sellele erakonnale annetatud, olenemata üksikute annetuste suurusest.",
      source: {
        austria:
          "Siin kasutatud andmed pärinevad Austria Kontrollikojast ja hõlmavad kõiki parteide annetusi, mis on seal dokumenteeritud alates 2012. aastast.\n" +
          "\n" +
          "Pange tähele: enne 8. juulit 2019 pidid erakonnad teatama kontrollikojale üle 51 000 euro (kuni 2018. aastani üle 50 000 euro) suurustest üksikannetustest. Alates 2019. aasta juulist on aruandluspiiriks 2500 eurot.\n" +
          "\n" +
          "Erakondade andmeid ajakohastatakse tavaliselt kord kvartalis.\n" +
          "\n" +
          "Translated with DeepL.com (free version)",
        germany:
          "Siin kasutatud andmed pärinevad Saksamaa Bundestagist ja hõlmavad kõiki alates 2010. aastast dokumenteeritud üle 50 000 euro ja alates 5. märtsist 2024. aastast üle 35 000 euro suuruseid annetusi erakondadele.",
        switzerland:
          "Siin kasutatud andmed pärinevad Šveitsi riigikontrollist ja hõlmavad kõiki seal alates 2023. aastast dokumenteeritud erakondade annetusi.",
        netherlands:
          "Siin esitatud teave on pärit Hollandi valitsuselt ja sisaldab kõiki alates aastast 2022 registreeritud poliitilisi annetusi, mis ületavad 1 000 €, nagu on märgitud iga-aastases aruandes „Overzicht van giften aan politieke partijen en hun neveninstellingen“.\n\nKäesoleva aasta jaoks on kaasatud ainult annetused, mis ületavad 10 000 €, tuginedes andmekogule „Overzicht substantiële giften aan politieke partijen“.\n\nPange tähele: mõnel annetusel puudub konkreetne kuupäevainfo ning seetõttu ei ole need lisatud ajareadesse ega teistesse kuupäeval põhinevatesse visualiseeringutesse.\n\nSP ja GL jaoks registreeritud annetused võivad tunduda suhteliselt suured, kuna mõlemad parteid nõuavad, et nende parlamendiliikmed ja haldurid annetaksid erakonnale märkimisväärse osa oma palgast.",
        europeanunion:
          "Die hier präsentierten Daten stammen von der Behörde für europäische politische Parteien und europäische politische Stiftungen und umfassen alle dokumentierten Partei- und Stiftungsspenden seit 2018. Aufgrund der Bedeutung der europäischen politischen Stiftungen werden deren Spenden ähnlich wie die der europäischen politischen Parteien erfasst und dargestellt.\n" +
          "\n" +
          "Da die offiziellen Daten keine Daten enthalten, sind keine Zeitreihen oder ähnliche visuelle Darstellungen verfügbar.\n" +
          "\n" +
          "Zu beachten ist, dass im Vorfeld der Europawahl 2024 (vom 6. Dezember 2023 bis 10. Juni 2024) besondere Meldepflichten für Spenden galten, mit wöchentlichen Meldungen und zeitnaher Veröffentlichung durch die Behörde.\n" +
          "Ab dem 10. Juni 2024 müssen nur noch Spenden über 12.000 Euro sofort gemeldet werden. Andere Spenden werden erst nach Vorlage des Jahresabschlusses zur Verfügung stehen.",
        estonia:
          "Siin kasutatud andmed pärinevad Eesti erakondade rahastamise seirekomisjonilt ja hõlmavad kõiki seal alates 2014. aastast dokumenteeritud poliitilisi annetusi, mis ületavad 1 euro.\n" +
          "\n" +
          "Eesti erakonnad on kohustatud oma tuludest, sealhulgas saadud annetustest, aru andma kord kvartalis.\n" +
          "Komitee veebilehel olevaid andmeid ajakohastatakse vastavalt kord kvartalis.",
        czechrepublic:
          "Siin kasutatud andmed pärinevad Poliitiliste Parteilide ja Poliitiliste Liikumiste Haldamise Kontrolli Ametist ning hõlmavad kõiki seal alates 2018. aastast dokumenteeritud poliitilisi annetusi, mis ületavad 25 CZK.\n" +
          "\n" +
          "See ulatus hõlmab ka kõiki annetusi erakondadele või poliitilistele liikumistele, mis on kas saanud üle 100 üksikud annetuse või mille kogusumma on ületanud 1 miljonit CZK, olenemata üksikannete suurusest. Andmeid ajakohastatakse kord aastas.\n" +
          "Annetajatüübi tuvastamine põhineb annetaja määramisel üksikisikuks, kui nii firstName kui ka lastName väljad on olemas.",
        latvia:
          "Siin kasutatud andmed pärinevad korruptsiooni ennetamise ja korruptsioonivastase võitluse ametilt ja hõlmavad kõiki seal alates 2015. aastast dokumenteeritud poliitilisi annetusi, mis ületavad 1 euro.",
        australia:
          'Siin kasutatud andmed pärinevad Australian Electoral Commissionist (AEC) ning täpsemalt AEC-i avaldatud andmestikust "Donations Made Details". See hõlmab kõiki seal dokumenteeritud poliitilisi annetusi alates 2014. aastast, mis ületavad €1.\n' +
          "\n" +
          "Tasub märkida, et AEC-i andmestik võib sisaldada mõningaid trükivigu, mille tõttu võivad teatud annetused jääda arvestusest välja või ei pruugi need andmesisestuse ebajärjekindluse tõttu olla korrektselt konkreetsele parteile omistatud. Lisaks avaldatakse AEC-i iga-aastased avalikustamised igal aastal 1. veebruaril, kuid andmed ei anna täielikku ülevaadet kõigist panustest, kuna avalikustamislävi on $15,000.\n" +
          "\n" +
          "Annetajate tüübid klassifitseeritakse annetajate nimede sobitamise teel. Kõik levinud ametiühingud kaardistatakse käsitsi annetajatüübi 'Ametiühing' alla. Ettevõtted tuvastatakse, kontrollides annetaja nimes konkreetseid ettevõtte tunnuseid: 'Pty' (Proprietary), 'Ltd' nime lõpus, 'Corporation' või 'Corp'.",
        unitedkingdom:
          "Siin kasutatud andmed pärinevad valimiskomisjonist ja hõlmavad kõiki poliitilisi annetusi, mis on seal dokumenteeritud alates 2010. aastast ja mis ületavad 1000 naela.\n" +
          "\n" +
          "Annetuste andmeid ajakohastatakse kord kvartalis.",
        serbia:
          "Siin kasutatud andmed ei pärine valitsuselt, vaid mittetulundusühingult „Serbia Uuriva Ajakirjanduse Keskus“ („Centar za istraživačko novinarstvo Srbije“ - CINS), mis on lahkesti koondanud Serbia Korruptsioonivastase Ameti annetuste andmed.\n" +
          "\n" +
          "Need andmed hõlmavad kõiki seal dokumenteeritud poliitilisi annetusi alates 2015. aastast.\n" +
          "\n" +
          "Kuna andmekogum ei sisalda konkreetset kuupäeva teavet üksikute annetuste kohta, ei ole kahjuks võimalik kuvada ajagraafikuid ega muid ajapõhiseid visualiseeringuid.",
        croatia:
          "Siin kasutatud andmed pärinevad Horvaatia Vabariigi Riiklikult Valimiskomisjonilt (DIP) ning hõlmavad kõiki poliitilisi annetusi rahalise väärtusega üle 1 €, mis on dokumenteeritud alates 2019. aastast.\nAndmestik kasutab iga aruandeaasta kohta ainult viimati avaldatud annetusdokumenti (nagu on teatanud izbori), et vältida sama aasta aruande varasemate versioonide duplikaate.\nKõik annetused kuvatakse eurodes, samas kui aluseks olev andmestik kasutab kuni 2024. aastani kunasid. Algselt kunades tehtud annetused teisendatakse eurodeks, kasutades ligikaudseid vahetuskursse iga poolaasta kohta ajavahemikus 2019–2024: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) ja H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          "Siin kasutatud andmed pärinevad Elections Canada’lt ja põhinevad andmekogul „contributions as submitted“. See hõlmab kõiki poliitilisi annetusi, mille rahaline väärtus ületab 500 €, dokumenteeritud alates 2015. aastast. Kaasatud on kõik kirjed, mis kuuluvad aruandesse „Statement of Contributions Received“ valimisürituselt „Annual“ registreeritud erakondadele.",
        georgia:
          "Siin esitatud teave pärineb Gruusia korruptsioonivastasest büroost (ანტიკორუფციული ბიურო﻿) ja hõlmab kõiki alates 2011. aastast registreeritud poliitilisi annetusi, mis ületavad 1 GEL. Andmekogum hõlmab ainult annetusi, mis on klassifitseeritud kui tüüp #10 (Rahaannetused) või tüüp #16 (Rahaannetused juriidilistelt isikutelt).",
        norway:
          "Siin kasutatud andmed pärinevad Statistics Norway (SSB) ja Partifinansiering.no ametlikest erakondade rahastamise publikatsioonidest. Kuva­tud kogusummad on koondatud mitme raporteeritud saajaüksuse (näiteks kesk-, piirkondlike, kohalike ja noorteüksuste) põhjal üheks kogusummaks erakonna kohta, kusjuures aluseks olev saajate vastendus on läbipaistvuse tagamiseks jätkuvalt kättesaadav.\n\nNorra andmestikku uuendatakse kord aastas, kajastades alusandmete avalikustamise rütmi.",
      },
      source_link: "Andmeallikas",
    },
    list: {
      subtitle: "Seadusandlikud perioodid",
      title: "Varasemad õigusloomeperioodid",
      summary:
        "Meie õigusloomeperioodi ülevaade annab täieliku ülevaate kõigist annetustest õigusloomeperioodi jooksul. Konkreetse õigusloomeperioodi üksikasjade vaatamiseks klõpsake kaardil.",
    },
    years: {
      title: "Iga-aastane ülevaade erakondade annetustest",
      subtitle: "Aasta jooksul kogunenud kogusummad",
      more: "Näita kõiki teisi aastaid",
      summary:
        "Meie iga-aastane peo annetuste ülevaade annab ülevaate kõigist annetustest igal aastal. Klõpsake kaardil, et minna üksikasjalikule aastaülevaatele.",
    },
    parties: {
      title: "Partei annetused",
      subtitle: "Üksikasjalikud andmed üksikute osapoolte kohta",
      more: "Näita kõiki teisi osapooli",
      summary:
        "Meie erakondade annetuste ülevaade esitab kumulatiivse esitluse kõikide annetuste kohta iga erakonna kohta. Klõpsake kaardil, et saada üksikasjalikku teavet annetuste kohta.",
    },
    donors: {
      title: "Annetajate annetused",
      subtitle: "Üksikute annetajate üksikasjad",
      summary:
        "Tutvuge meie annetajate ülevaatega, mis näitab olulisimaid rahalisi toetajaid alates aastast {minYear}. Klõpsake annetajal, et vaadata tema panuse üksikasjalikku teavet.",
    },
    stacked_years: "Annetuse summa aastas",
    stacked_years_subtitle:
      "Avaldatud annetuste koondsumma riigis {country} aastate lõikes alates {years}.",
  },
  years: {
    title: "Partei annetused",
    subtitle:
      "Avaldatud annetuste kumulatiivne summa igale parteile riigis {country}, {years}.",
    goto_year: "Hüpe aastasse {year}",
    no_data: {
      title: "Andmed pole saadaval",
      summary:
        "Vabandame, kuid meil pole veel {year}. aasta annetuste andmeid.",
      last_year: "Alternatiivina vaadake {year}. aasta andmeid.",
    },
  },
  overview: {
    title: "Ülevaade",
    detail: {
      title: "Suurimad erakonnad ja nende annetuste kogusumma",
      summary:
        "Selles nimekirjas on esitatud kõige olulisemad erakonnad ja nende kumulatiivsed annetused teatud ajavahemiku jooksul, sorteeritud annetuste summa järgi.",
      summary2:
        "In den Jahren {years} erhielten insgesamt {partyCount} Parteien durch {donationCount} Spenden über {minimumAmount} eine Gesamtsumme von {donationSum}.",
      most_donations:
        "Die {party} erhielt die meisten Spenden mit insgesamt {count} Zuwendungen und einer Gesamtsumme von {sum}.",
      highest_sum:
        "5 erakonda, kes on saanud kõige rohkem annetusi, on {parties}.",
    },
    scatter: {
      title: "Annetuste jaotamine",
      subtitle:
        "Individuaalsed annetused igale parteile summade ja sageduse järgi riigis {country} alates {years}.",
      summary:
        "Ülevaade erakondade annetuste jagunemisest annab ülevaatliku analüüsi annetuste jagunemisest erinevate erakondade vahel. Iga punkt tähistab ühte erakonda, x-telg näitab annetuste summasid ja hajuvusdiagramm annetuste sagedust.",
      span: "Suurima annetuste vahega oli {biggestSpanParty} erakond, kus väikseima ja suurima annetuse vahe oli {biggestSpanAmount}.",
    },
    pie: {
      title: "Erakondade annetuste jagamine",
      subtitle: "Kokku avaldatud annetused igale parteile, {country}, {years}.",
    },
  },
  changes: {
    title: "Muudatused",
    description:
      "Uurige üksikasjalikku tabelit poliitiliste parteide annetustest riigis {country} aastast {year}, ainult üle {minAmount} annetused, sorteeritud tehingukuupäeva järgi, koos annetaja ja summa teabega.",
    detail: {
      title: "Poolte annetused tehingu kuupäeva järgi",
      summary:
        "Sellel lehel kuvatakse erakondade annetused tehingu kuupäeva järgi, kusjuures kõige eespool on loetletud kõige hiljutisemad annetused. Teave on esitatud selle kohta, kui palju raha on iga erakond milliselt annetajalt saanud.",
    },
  },
  donors: {
    title: "Doonor",
    description:
      "Vaadake täielikku nimekirja {year}. aasta poliitilistele parteidele annetajatest riigis {country}. Uurige, kes annetas kõige rohkem ja kui palju igaüks panustas.",
    detail: {
      title: "Doonorite annetused erakondadele",
      subtitle:
        "Kokku avaldatud individuaalsete annetajate panused igale erakonnale riigis {country}, {years}.",
      summary:
        "Treemap visualiseerib erakondade annetusi selgelt struktureeritud kujul. Ülemisel tasandil on esitatud üksikud annetajad, kes on kujutatud ristkülikutena, mille suurus on proportsionaalne nende annetuste summaga.",
      summary2:
        "Iga annetaja all on veel ristkülikud, mis kujutavad vastavaid vastuvõtvaid erakondi. Selline hierarhiline paigutus annab kiire ülevaate annetuste jaotusest ja näitab ühe pilguga, kui palju abisaajaid iga annetaja on toetanud.",
      unique_donors:
        "Erinevate doonorite arv {years}. aastal on {count} doonorit.",
      biggest_donor: "Suurim annetus, {amount}, tuli {donor}.",
      most_donations:
        "{count} annetusega (kogusumma {sum}) juhib {donor} kõige sagedasemate üksikannetajate nimekirja.",
      most_unique_parties:
        "{donor} tegi annetusi kokku {count} erinevale osapoolele (kogusumma: {sum}), mis näitab, et annetuste saajate hulgas on suurim mitmekesisus.",
      top_3: "{years} aasta {amount} suurimad annetajad on {donors}.",
    },
    list: {
      title: "Parimad üksikisikud annetajad kogu annetuste järgi",
      p0: "See jaotis esitab kõigi üksikisikute annetajate järjestatud loetelu valitud aastate jooksul, sorteeritud nende avaldatud annetuste kumulatiivse summa järgi. Nii rõhutatakse annetajaid, kes on kõige rohkem panustanud.",
    },
    sankey: {
      title: "Sankey diagramm",
    },
    histogram: {
      title: "Annetajate jaotus unikaalsete saajate arvu järgi",
      subtitle:
        "Unikaalsete erakondade arv, kes said avaldatud annetusi üksikannetajatelt riigis {country}, aastatel {years}.",
      p0: "See diagramm annab ülevaate sellest, kuidas üksikannetajad jaotavad oma annetused erakondade vahel, näidates, kas nad kalduvad toetama ühte erakonda või jaotama toetuse aja jooksul mitmele.",
      p1: "Aastal {years} oli suurim erinevate erakondade arv, mida üks annetaja toetas, {max}. Ainult {donors} annetaja panustas {max} erakonda. Keskmiselt toetas iga annetaja {mean} erakonda (mediaan: {median}).",
      p2: "{totalDonors} annetajast annetas {singlePartyDonors} ainult ühele parteile, mis moodustab {percentage} annetajatest.",
      tooltip: "{donors} annetajat • {parties} unikaalset erakonda",
      item: "{donors} annetajat annetas {parties} erakonnale",
    },
  },
  timeline: {
    title: "Arendus",
    description:
      "Vaadake kõigi poliitiliste parteide annetuste ajatelge riigis {country} aastate {years} kohta, koos igakuiste kogusummade ja aastate lõikes trendidega.",
    detail: {
      title: "Erakondade annetuste areng aja jooksul",
      summary:
        "Vaadake allolevat interaktiivset joongraafikut, et jälgida iga erakonna annetuste ajalugu aja jooksul. x-telg näitab kuupäevi, y-telg aga annetuste summat. Iga erakond on kujutatud eraldi joonega, mis kasvab iga annetusega.",
    },
    days: "Riigis {country} registreeriti {years} jooksul annetusi {n} erineval päeval.",
  },
  per_year_party: {
    title: "Annetused erakonnale {party} aastas",
    subtitle:
      "Avaldatud annetuste aastane summa erakonnale {party} riigis {country}, {years}.",
  },
  per_month: {
    title: "Annetused kuus",
    subtitle:
      "Avaldatud annetuste kuusumma igale parteile riigis {country}, {years}.",
    description:
      "See kuhjatud tulpdiagramm illustreerib mitme erakonna igakuiseid annetusi. x-telg näitab kuud, y-telg kujutab annetuste summasid ja iga tulp on segmenteeritud värvi järgi, et näidata üksikute erakondade annetusi, mis võimaldab hõlpsasti võrrelda erakondade annetusi nii kuude sees kui ka kuude lõikes.",
    highest_sum:
      "{month} oli suurim annetuste kogusumma, kokku {count} annetust summas {sum}.",
    most_months:
      "{party} sai annetusi {count} kuu jooksul – enim kuid annetustega kõigi parteide seas.",
    month_most_donations:
      "Kõige suurema annetuste arvuga kuu oli {month}, mil laekus kokku {count} üksikannetust.",
  },
  party: {
    donors: {
      title: "{party} doonorid",
      subtitle:
        "Kokku avaldatud individuaalsete annetajate panused erakonnale {party} riigis {country}.",
      summary:
        "See lehekülg esitab kõik ametlikult avalikustatud annetused üle {minSum} parteile {party} alates {minYear}, grupeerituna annetajate kaupa, et näidata kogupanuseid aja jooksul. Kõik arvud põhinevad ametlikel avalikustamistel, mille on avaldanud {source}, näidatud nii puukaardina visuaalseks võrdluseks kui ka laiendatava aluseks olevate tehingute loendina.",
    },
    donor_types: {
      title: "Annetajate tüübid",
      treemap: {
        title: "Annetajate tüübid erakonna {party} jaoks",
        description:
          "Kokku avaldatud annetused erakonnale {party} riigis {country} annetajatüübi järgi.",
      },
      p0: "See puukaart rühmitab teatatud poliitilised annetused annetajatüüpide järgi (näiteks eraisikud, ettevõtted ja avalikud fondid) ning määrab iga ruudu suuruse vastavalt antud perioodi ja ulatuse kogusummale.",
      p1: "Suuremad ruudud näitavad suuremaid summasid ja igas ruudus olevad nimed tähistavad suurimaid annetajaid vastavas kategoorias. See vaade sisaldab {count} erinevat annetajatüüpi erakonna {party} jaoks.",
      p2: "Allpool on loetelu sektoritest, mis on järjestatud kogupanuste järgi, kõrgeimast madalaimani:",
    },
    qa: {
      sum: {
        q: "Kui palju on {party} annetusi saanud?",
        a: "{party} on saanud kokku {sum} annetustes {count} dokumenteeritud annetusest.",
      },
      top_donors: {
        q: "Kes on {party} suurimad annetajad?",
        a: "{party} suurimad annetajad on: {donors}.",
      },
      largest_singular: {
        q: "Milline oli suurim üksik annetus {party}-le?",
        a: "Suurim üksik annetus oli {amount} annetajalt {donor} kuupäeval {date}.",
      },
      biggest_overall: {
        q: "Kes on {party} suurim üldine annetaja?",
        a: "{party} suurim üldine annetaja on {donor} koguannetustega {sum}.",
      },
      frequent_donor: {
        q: "Kes on teinud kõige rohkem annetusi {party}-le?",
        a: "{donor} on teinud kõige rohkem annetusi {party}-le {count} eraldi annetusega kogusummas {sum}.",
      },
    },
    overview: {
      title: "Ülevaade annetustest {party}",
    },
    changes: {
      detail: {
        title: "{party} annetused tehingu kuupäeva järgi",
        summary:
          "Sellel lehel on {party} annetuste nimekiri, mis on sorteeritud tehingu kuupäeva järgi, kusjuures kõige uuemad annetused on kõige eespool. See annab teavet selle kohta, kui suur on iga annetuse summa {party}-le ja vastavatele annetajatele.",
      },
    },
    timeline: {
      chart_title: "{party} partei annetused",
      subtitle:
        "Avaldatud annetuste kumulatiivne summa erakonnale {party} riigis {country}.",
      detail: {
        title: "{party} annetused aja jooksul",
        summary:
          "Uuri interaktiivset joondiagrammi, et jälgida {party} annetuste ajalugu ajas. X-telg kujutab kuupäevi, Y-telg näitab annetatud rahasummat. {party} on esitatud eraldi joonega, mis kasvab iga annetusega.",
        per_year:
          "{party} poolt saadud annetuste kogusumma varieerub aasta lõikes. Allpool on ajalooline ülevaade partei deklareeritud iga-aastastest rahastuse kogusummadest. See loetelu jälgib kõigi aruandluskohustuslike panuste ja rahalise toetuse summat iga konkreetse aasta kohta:",
      },
    },
  },
  origin: {
    title: "Päritolu",
    description:
      "Vaadake, kust pärinevad poliitiliste parteide annetused riigis {country} aastatel {years}—jaotus osariikide ja rahvusvaheliste panuste lõikes.",
    detail: {
      title: "Annetuse päritolu lühidalt",
      description:
        "Vaadake {country} riigis {party} erakonnale tehtud poliitiliste annetuste läbipaistvat päritolu: jaotus osariikide ja välismaiste allikate järgi.",
      summary:
        "Saate selge ülevaate annetuste geograafilisest päritolust. Uurige, millistest liidumaadest või riikidest väljaspool {country} toetus pärineb. Jälgige läbipaistvalt, kuidas annetused geograafiliselt jaotuvad.",
      country: {
        austria:
          "Austrias registreeritakse annetuste päritolu alles alates 2023. aastast. Seetõttu ei saa kõiki vanemaid annetusi üksikutele liidumaadele määrata.",
      },
      sum: "{years}. aastal moodustasid erakondade annetused {country}s kodumaistelt allikatelt kokku {sumCountry}. Välismaistelt allikatelt pärit sissemaksed ulatusid {sumOthers}.",
    },
    type: {
      map: "Kaart",
    },
    party: {
      subtitle:
        "Kokku avaldatud annetused {party} päritoluriigi järgi riigis {country}.",
    },
    country: {
      title: "Annetused {country}",
      subtitle:
        "Kokku avaldatud annetused päritoluriigi järgi riigis {country}, {years}.",
      summary:
        "Aastatel {from}-{until} registreeriti annetusi {stateCount} eri liidumaalt. Kõige suurema annetussummaga liidumaa on {highestState} {highestSum}. Kõige rohkem annetusi, nimelt {largesDonationCountNum}, tuli {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Annetused välismaalt",
      summary:
        "Aastatel {from}-{until} registreeriti annetusi {countryCount} erinevast riigist. Kõige suurema annetussummaga riik on {highestCountry} {highestSum}. Kõige rohkem annetusi, {largesDonationCountNum}, tuli {largesDonationCountState}.",
    },
  },
  state: {
    germany: {
      BW: "Baden-Württemberg",
      BY: "Baieri",
      BE: "Berliin",
      BB: "Brandenburg",
      HB: "Bremen",
      HH: "Hamburg",
      HE: "Hesse",
      MV: "Mecklenburg-Vorpommeri",
      NI: "Alam-Saksi liidumaa",
      NW: "Nordrhein-Westfalen",
      RP: "Rheinland-Pfalz",
      SL: "Saarimaa",
      SN: "Saksimaa",
      ST: "Saksi-Anhalti liidumaa",
      SH: "Schleswig-Holstein",
      TH: "Tüüringi",
    },
    austria: {
      "1": "Burgenland",
      "2": "Kärnteni",
      "3": "Alam-Austria",
      "4": "Ülem-Austria",
      "5": "Salzburg",
      "6": "Styria",
      "7": "Tirol",
      "8": "Vorarlberg",
      "9": "Viin",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Nova Scotia",
      NB: "New Brunswick",
      MB: "Manitoba",
      BC: "Briti Columbia",
      PE: "Prints Edwardi saar",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Newfoundland ja Labrador",
      NT: "Loodealad",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  donor: {
    title: "Annetaja annetused",
    subtitle: "Panused ja saajad kokku",
    active_period: "Aktiivne periood",
    type: "Annetajatüüp",
    summary:
      "{donor} on teinud kokku {sum} {count} eraldi annetusena. Keskmine annetuse suurus on {avg}. Annetused on jagatud {parties} eri erakonna vahel.",
    oldest:
      "Esimene annetus pärast {minYear} tehti {date} summas {amount} erakonnale {party}.",
    newest:
      "Viimane annetus tehti {date}, kui {amount} läks erakonnale {party}.",
    most_donations: "Kõige sagedamini tehti annetusi {list}.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Aastal {biggestYear} oli suurim annetuste kogusumma {biggestSum}, samas kui aastal {mostYear} tehti kõige rohkem üksikannetusi ({mostCount}).",
    biggest:
      "Suurim üksikmakse summas {amount} läks {date} erakonnale {party}.",
    tree_map: "{name} annetused",
    tree_map_subtitle:
      "Kokku avaldatud annetused igale parteile riigis {country}.",
    biggest_amounts:
      "Annetused olid peamiselt suunatud valitud parteide rühmale. Allpool on andmed saajate kaupa summade ja annetatud kogusumma protsendi järgi:",
    table:
      "See jaotis annab põhjaliku ülevaate kõigist {donor} poolt tehtud üksikutest annetustest. Saate tabelit sorteerida kuupäeva, partei või summa järgi, et hõlpsasti uurida, kuidas annetused on aja jooksul ja saajate vahel jaotunud. See detailne vaade võimaldab iga panuse läbipaistvat jälgimist ning pakub sügavamat pilku annetaja annetamismustritesse.",
    timeline: {
      title: "Annetuste kogunemine ajas",
      p0: "See jaotis näitab, kuidas {donor} annetused alates {year} erinevatele erakondadele on aja jooksul muutunud. Graafik visualiseerib annetatud kogusumma, kus iga erakonna osa on esile tõstetud, et oleks lihtne näha, millal ja kuhu toetus suunati.",
      p1: "Jälgige jooni, et märgata mustreid, tippe või muutusi annetamises. See ülevaade pakub läbipaistvat pilku, kuidas ühe annetaja panused on poliitilisel maastikul jaotatud.",
      years:
        "Annetused on aastate jooksul kõikunud. Järgneb iga aasta kogusumma koos protsendiga sellest, kui palju see aasta annab annetuste kogusummast antud annetaja puhul.",
      chart_subtitle:
        "Kumulatiivsed annetused {donor} poolt poliitilistele parteidele riigis {country}, kuvatud summa ja kuupäeva järgi alates {minYear}.",
    },

    anonymized: {
      title: "Kirje anonümiseeritud",
      description:
        "Selle annetusega seotud isikuandmed on eemaldatud vastavalt kehtivale GDPR-i taotlusele. Annetuse summa jääb kogurahastuse arvestustesse, et säilitada finantsläbipaistvus.",
    },

    redacted: {
      title: "Kirje varjatud",
      description:
        "Avaldav asutus varjas annetaja isikuandmed enne nende andmete avaldamist. Annetuse summa on siiski kogurahastuse arvutustes arvesse võetud, et säilitada finantsläbipaistvus.",
    },
    ubo: "Tegelikud kasusaajad (TK)",
    ubo_description:
      'Tegelik kasusaaja (TK) on isik, kes tegelikult niite tõmbab. Need on üksikisikud, kes lõpuks omavad või kontrollivad annetajat, tavaliselt omades 25% või rohkem tema aktsiatest või hääleõigustest. Kui ükski üksikisik ei vasta sellele künnisväärtusele, võidakse kõrgem juhtkond (nagu direktorid) loetleda "pseudo-TK-dena", et tagada vastutus.',
  },
  countries: {
    "??": "Ei ole täpsustatud",
    DE: "Saksamaa",
    DK: "Taani",
    CH: "Šveits",
    TH: "Tai",
    AT: "Austria",
    UK: "Suurbritannia",
    NL: "Madalmaad",
    EU: "Euroopa Liit",
    LV: "Läti",
    ES: "Hispaania",
    FI: "Soome",
    HR: "Horvaatia",
    BE: "Belgia",
    LU: "Luksemburg",
    SI: "Sloveenia",
    EE: "Eesti",
    FR: "Prantsusmaa",
    IE: "Iirimaa",
    IT: "Itaalia",
    PL: "Poola",
    RO: "Rumeenia",
    CY: "Küpros",
    MT: "Malta",
    PT: "Portugal",
    LT: "Leedu",
    HU: "Ungari",
    CZ: "Tšehhi Vabariik",
    SG: "Singapur",
    MC: "Monaco",
    SE: "Rootsi",

    AD: "Andorra",
    IM: "Mani saar",
    NO: "Norra",
    LI: "Liechtenstein",
    MK: "Makedoonia",
    AL: "Albaania",
    MD: "Moldova",
    SM: "San Marino",
    FO: "Fääri saared",
    BA: "Bosnia ja Hertsegoviina",
    ME: "Montenegro",
    BG: "Bulgaaria",
    BY: "Valgevene",
    GR: "Kreeka",
    IS: "Island",
    SK: "Slovakkia",
    UA: "Ukraina",
    GB: "Ühendkuningriik",
    RS: "Serbia",
    AU: "Austraalia",
    ZA: "Lõuna-Aafrika Vabariik",
    US: "Ameerika Ühendriigid",
    CA: "Kanada",
    GE: "Gruusia",
    NZ: "Uus-Meremaa",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Saksamaa",
    DK: "Taani",
    CH: "Šveits",
    TH: "Tai",
    AT: "Austria",
    UK: "Suurbritannia",
    NL: "Madalmaad",
    EU: "Euroopa Liit",
    LV: "Läti",
    ES: "Hispaania",
    FI: "Soome",
    HR: "Horvaatia",
    BE: "Belgia",
    LU: "Luksemburg",
    SI: "Sloveenia",
    EE: "Eesti",
    FR: "Prantsusmaa",
    IE: "Iirimaa",
    IT: "Itaalia",
    PL: "Poola",
    RO: "Rumeenia",
    CY: "Küpros",
    CZ: "Tšehhi Vabariik",
    AU: "Austraalia",
    RS: "Serbia",
    CA: "Kanada",
    GE: "Gruusia",
    NO: "Norra",
  },
  about: {
    title: "Meie kohta",
    description: {
      p0: "DonationWatch sai alguse sellest, et Saksamaa Bundestagi ametlikul veebisaidil ei ole andmed loetavad.",
      p1: "Meie eesmärk on seda parandada, kasutades ainult avalikult kättesaadavaid andmeid ja esitades neid tõhusamalt.",
      p2: "Me saime aru, et sellised riigid nagu Austria, Šveits ja Madalmaad avaldavad erakondade annetusi erinevalt. Et luua standardiseeritud liides, mis lihtsustab juurdepääsu nendele andmetele, oleme need riigid oma projekti kaasanud. Teised riigid järgnevad niipea, kui me leiame ja töötleme asjaomased andmed.",
      p3: "Kui teil on ettepanekuid või tagasisidet, võtke meiega",
      mail: "julgelt ühendust",
    },
    source:
      "Kõik visualiseeritud andmed pärinevad üksnes avalikult kättesaadavatest valitsusallikatest ega sisalda varasematel aegadel avaldamata andmeid või eraarhiive. Läbipaistvus on meie aluspõhimõte.",
  },
  imprint: {
    title: "Jälg",
  },
  privacy: {
    title: "Andmekaitse",
    last_updated: "Viimati uuendatud: {date}",
    effective_date: "Jõustumiskuupäev: {date}",
    data: {
      title: "1. Andmete kogumine",
      p: "Me ei kogu veebisaidi külastajatelt isikuandmeid. See hõlmab:",
      li0: "Registreerimisvorme ei ole",
      li1: "Uudiskirjade tellimisi ei ole",
      li2: "Kasutajakontosid ei ole",
      li3: "Küpsiseid jälgimiseks ei kasutata",
    },
    cf: {
      title: "2. Cloudflare'i teenused",
      link: "Vaata Cloudflare'i privaatsuspoliitikat",
      p: "Kasutame kaht Cloudflare'i teenust:",
      workers: {
        summary:
          "Cloudflare Workers: Serverivaba platvorm sisu kättetoimetamiseks (kasutajate andmeid ei töödelda)",
      },
      analytics: {
        summary:
          "Cloudflare Web Analytics: Privaatsust austav analüüsi tööriist, mis:",
        li0: "Ei kasuta küpsiseid",
        li1: "Kogub ainult agregeeritud mõõdikuid",
      },
    },
    logs: {
      title: "3. Automaatsed serverilogid",
      p: "Meie hostingupakkuja võib koguda:",
      li0: "IP-aadresse (anonüümistatud)",
      li1: "Päringute ajatemplid",
      li2: "Brauseri/seadmetüübid",
      retention: "Need andmed kustutatakse automaatselt 7 päeva jooksul.",
    },
    contact: {
      title: "Kontakt",
      p: "Privaatsusküsimuste korral:",
    },
  },
  fun: {
    link: "Lõbusad faktid",
    title: "Lõbusad faktid avalike andmete kohta",
    p0: "See leht näitab huvitavaid leide meie tööst avalikult kättesaadavate valitsuse andmetega. Need tähelepanekud ei ole kriitika, vaid pigem väikesed eripärad, mis võivad esineda igas suures andmekogumis.",
    p1: "Kuigi me teavitame probleemidest, kui see on asjakohane, ei pea me neid kiireloomulisteks küsimusteks, mida valitsusasutused peaksid lahendama. Meie kogemuse põhjal on need organisatsioonid olnud vastuvõtlikud ja avatud tagasisidele.",
    reported_fixed: "Sellest teatati {owner} ja nad parandasid selle.",
    reported_wontfix: "Sellest teatati {owner}-le ja nad ei saa seda muuta.",
    reported: "Sellest teatati {owner}.",
  },
  transparency: {
    title: "Läbipaistvus",
    p0: "Me püüame anda selget ja järjepidevat teavet erakondade annetajate kohta. Selle saavutamiseks normaliseerime automaatselt teatud annetajate nimed, et tagada ühtsus kogu meie andmebaasis. See lähenemisviis võimaldab meil säilitada täpsuse, võttes samal ajal arvesse erinevusi nimede registreerimises.",
    p1: "Läbipaistvuse huvides oleme koostanud nimekirja normaliseeritud nimedest koos nende variatsioonidega, mida oleme oma annetuste andmetes kohanud. Allpool leiate iga normaliseeritud nime koos selle variatsioonidega. See nimekiri aitab selgitada, miks võite näha annetajate nimesid, mis ei pruugi täpselt meie allikadokumentides esineda.",
    section: {
      filtered_donors: "Filtreeritud annetajad",
      filtered_receivers: "Filtreeritud saajad",
      aggregated: "Koondatud annetajad",
    },
    filtered_donors: {
      p0: "Poliitiliste annetuste tegelike allikate täpseks esitamiseks filtreerime välja teatud tehingud, mis on tegelikult riiklikud toetused, mitte ehtsad annetused. Kuna meie lähteandmestikud neid tehinguid otsesõnu ei märgista, tugineme regulaaravaldiste (regexp) filtrireeglite kogumile, et sellised kirjed automaatselt tuvastada ja eemaldada. Allpool saate vaadata kõiki rakendatud regexp-filtrireegleid.",
      p1: "Allpool on loetelu annetajatest, kelle panused filtreeriti välja vastavalt meie kriteeriumidele ja filtrireeglitele.",
    },
    filtered_receivers: {
      p0: "Selleks, et esitada ainult sisukaid saajate andmeid, filtreerime välja ka teatud saajad või erakonnad, mida peetakse annetajate jälgimise seisukohalt ebaoluliseks või mitteaktiivseks. Kuna meie andmestikud ei märgista neid saajaid alati otsesõnu, rakendame regulaaravaldistel (regexp) põhinevaid reegleid, et need automaatselt välja jätta.",
      p1: "Allpool saate vaadata kõiki rakendatud regexp-filtrireegleid.",
    },
    receivers: {
      title: "Koondatud saajad",
      p0: "Riigis {country} võidakse annetused esitada eri erakonna organisatsioonilistele üksustele. Ühtsuse tagamiseks koondame seotud saajaüksused üheks erakonna tasandi kogusummaks. Allolev loetelu kirjeldab, millised saajaüksused on iga erakonna puhul koondatud.",
    },
  },
  related: {
    donors: "Sarnased doonorid",
  },
  similar_donors: {
    title: "Sarnaste annetajate võrgustik",
    description:
      "Avastage selle annetajaga seotud laiemat annetajate võrgustikku.",
    summary: "Seotud annetajate võrgustikus on {count} unikaalset annetajat.",
    list_title: "Parteide jaotuse ülevaade",
  },

  detect_country: {
    title: "Tundub, et olete riigis {country}.",
    description: "Puudutage, et uurida poliitilisi annetusi riigis {country}.",
    action: "Vaata annetusi riigile {country}",
  },

  donor_type: {
    [DonorType.PublicFund]: "Avalik fond",
    [DonorType.Individual]: "Eraisik",
    [DonorType.Company]: "Ettevõte",
    [DonorType.Other]: "Muu",
    [DonorType.TradeUnion]: "Ametiühing",
    [DonorType.UnincorporatedAssociation]: "Mittetulundusühing",
    [DonorType.RegisteredPoliticalParty]: "Registreritud erakond",
    [DonorType.Trust]: "Usaldusfond",
    [DonorType.FriendlySociety]: "Abiselts",
    [DonorType.LimitedLiabilityPartnership]: "Piiratud vastutusega ühing",
    [DonorType.BuildingSociety]: "Hoonetusselts",
    [DonorType.NonProfitLegalEntity]: "Mittetulunduslik juriidiline isik",
    [DonorType.AnonymizedDonor]: "Anonümiseeritud annetaja",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Teised riigid",
  },

  thanks:
    "Täname selliseid organisatsioone nagu {external}, kes pakuvad väärtuslikku teavet poliitiliste annetuste mehhanismide kohta.",

  export: {
    title: "Andmete eksport",
    p0: "Hankige sellel saidil kasutatav täielik poliitiliste annetuste andmestik riigi {country} kohta. Eksport sisaldab normaliseeritud annetajate nimesid, summasid, kuupäevi ja saajaparteisid.",
    p1: "Oluline: Need ei ole {source} toorandmed. See andmestik sisaldab ainult annetusi, mille meie meeskond on normaliseerinud ja filtreerinud. Metoodika kohta vaadake palun meie jaotist {transparency}.",
    license: "Litsents: {license}",
    download: "Laadi alla {format}",
    includes_donations: "Sisaldab {num} annetust",
  },
  bar_chart_race: {
    title: "Tulpdiagrammi võidusõit",
    description:
      "Visualiseeri annetuste kumuleerumist ajas. Vali aastavahemik, et näha, kuidas erakondade rahastamine dünaamiliselt muutub.",
    from: "Alates",
    to: "Kuni",
    download_video: "Laadi video alla",
    rendering: "Renderdamine... {percentage}",
    no_data: "Valitud vahemiku kohta andmed puuduvad.",
    note: "Palun pange tähele: see animatsioon renderdatakse teie brauseris kliendipoolel ja võib mõnes seadmes olla ressursimahukas. Video allalaadimine esitab automaatselt kogu animatsiooni.",
    individual_years: "Üksikud aastad",
    animation_duration: "Animatsiooni kestus",
    duration_s: "{seconds}s",
    group_by: {
      label: "Rühmitamine",
      receiver: "Erakond",
      donor: "Annetaja",
    },
  },
};

export default Et;
