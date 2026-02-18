import { DonorType } from "../utils/types";

const Nl = {
  copyright: "Auteursrecht",
  charts_license: "Grafieken gelicentieerd onder {license} met naamsvermelding",
  data_error: "Gegevens konden niet geladen worden",
  description:
    "DonationWatch biedt heldere inzichten in donoren en partijen, waardoor het eenvoudiger wordt om politieke financiering te begrijpen door complexe gegevens in eenvoudige bewoordingen uit te leggen.",
  title: "Partijgiften {country}",
  sum: "Totaal",
  donation_count: "Aantal giften",
  average: "Gemiddelde",
  donations_by_party: "Giften per partij",
  donations_per_year: "Giften per jaar",
  party_donations: "Partijgiften",
  more: "Meer",
  loading: "Inhoud is geladen",
  data_since: "Sinds {year}",
  view_party: "Bekijk de {party} partijpagina",
  faq: "Veelgestelde vragen",
  sidebar: {
    toggle: "Zijbalk schakelen",
    donations: "Donaties",
    all_countries: "Alle landen",
    tools: "Hulpmiddelen",
    show_all: "Alles weergeven ({num})",
    show_less: "Minder weergeven",
  },
  search: {
    filter: "Zoeken...",
    filter_description: "Zoeken naar partijen, jaren of donateurs",
    parties: "Partijen",
    years: "Jaren",
    legislative_years: "Wetgevende jaren",
    empty: "Geen resultaten gevonden",
    donors: "Donateurs",
  },
  page_title: {
    years: {
      description:
        "In {year} ontvingen {parties} partijen in {country} in totaal {sum} uit {count} donaties boven {minAmount}. Bekijk gedetailleerde overzichten per partij, donor en trends in politieke financiering.",
      overview:
        "Overzicht van donaties van politieke partijen in {country} voor {year}",
      changes:
        "Recente veranderingen in donaties aan politieke partijen in {country} voor {year}",
      donors:
        "Belangrijkste donateurs van politieke partijen in {country} voor {year}",
      timeline:
        "Tijdlijn van donaties aan politieke partijen in {country} voor {year}",
      origin:
        "Geografisch overzicht van partijdonaties in {country} voor {year}",
    },
    party: {
      donors: "Topdonoren van {party} {country}",
      changes: "Recente wijzigingen in {party}-donaties {country}",
      timeline: "Tijdlijn van {party}-partijdonaties {country}",
      origin: "Geografisch overzicht van {party}-partijdonaties {country}",
      description:
        "Sinds {year} heeft de {party} in totaal {count} donaties ontvangen van meer dan {minimumAmount}, met een cumulatief bedrag van {sum}. Ontdek gedetailleerde informatie over grote donoren en donatietrends aan de {party} in {country}.",
    },
    donor: {
      overview: "Donaties van {donor} in {country}",
      description:
        "{donor} heeft in totaal {sum} gedoneerd via {count} donaties van meer dan {minAmount} sinds {minYear}. Deze bijdragen werden verdeeld over {parties} verschillende partijen. Ontdek gedetailleerde inzichten in donatiepatronen en ontvangerspartijen voor deze donateur in {country}.",
    },
  },
  chart: {
    save_as_image: "Opslaan als afbeelding",
    toggle_fullscreen: "Volledig scherm inschakelen",
    reset_zoom: "Zoom zurücksetzen",
  },
  over_min_public_amount: "meer dan {amount}",
  over_threshold: "alleen partijen met ≥ {count} donaties of ≥ {sum}",
  prelim_data: "voorlopige gegevens sinds {year}",
  excludes_year_only_donations: "sluit donaties met alleen jaar als datum uit",
  common: {
    date: "Datum",
    party: "Partij",
    donor: "Donateur",
    amount: "Bedrag",
    anonymizedDonor: "Geanonimiseerde donor",
    redactedDonor: "Geanonimiseerde donor",
  },
  sort: {
    asc: "Sorteer oplopend",
    desc: "Sorteer aflopend",
    clear: "Wis sortering",
  },
  footer: {
    sources: "Bronnen",
    build: "Status {date}",
    build_since: "Vanaf {date}, sinds {year}",
    published_by: "Zoals gepubliceerd door {source}",
  },
  header: {
    home: "Startpagina",
    language_selection: "Taalkeuze",
    country_selection: "Land selecteren",
  },
  actions: {
    close: "Sluiten",
    play: "Afspelen",
    pause: "Pauzeren",
    restart: "Opnieuw starten",
  },
  donor_dialog: {
    title: "Donorgegevens",
    summary: "Samenvatting",
  },
  donation_dialog: {
    title: "Donatie details",
    donor: "Donor",
    country: "Land",
    state: "Federale staat",
    receiver: "Ontvanger",
    donation_amount: "Donatiebedrag",
    date: "datum",
  },
  root: {
    title: "Open-source tracker voor donaties aan politieke partijen",
    subtitle:
      "Volg en verken politieke donaties in meerdere landen. Begrijp wie politieke partijen financiert en hoe geld wereldwijd stroomt.",
    stats: {
      countries: "Gedekte landen",
      parties: "Politieke partijen",
      donations: "Individuele donaties",
      currencies: "Bijgehouden valuta's",
    },
    countries: {
      title: "Verken politieke donaties per land",
      subtitle:
        "Selecteer een land om toegang te krijgen tot gedetailleerde donatieregistraties, gegevens over partijfinanciering en donorinformatie.",
    },
    why: {
      title: "Waarom transparantie over politieke donaties belangrijk is",
      p0: "Democratie is afhankelijk van geïnformeerde burgers. Door gegevens over politieke donaties toegankelijk en eenvoudig te verkennen te maken, helpen we mensen de financiële relaties te begrijpen die hun politieke landschap vormen. Transparantie in politieke financiering bouwt vertrouwen op, versterkt de verantwoordingsplicht en stelt kiezers in staat om weloverwogen beslissingen te nemen.",
    },
    open_source: {
      title: "Open Source",
      p0: "DonationWatch is open source. Je kunt de code bekijken, problemen melden of bijdragen via {github}.",
    },
  },
  home: {
    most_recent: "Recente giften",
    hero: {
      subtitle: "Tracker voor giften van politieke partijen in {country}",
      subtitle_no_country: "Tracker voor giften van politieke partijen",
    },
    biggest_donations: {
      text: "Kopš {minYear} gada lielākā atklātā atsevišķā ziedojums {country} sasniedza {amount} no {donor} partijai {party} {year} gadā. Tam seko {others}.",
      list: "{amount} no {donor} saņēmējam {receiver}",
    },
    last_period: "Meest recente jaar:",
    previous_period: "Donaties van vorig jaar.",
    what: {
      title: "Wat is dit?",
      summary:
        "Partijgiften zijn een belangrijk onderdeel van de politiek. Ze zijn een belangrijke indicator van politieke steun.\n\nWe proberen deze gegevens duidelijk en begrijpelijk weer te geven.",
      threshold:
        "Vanwege het grote aantal kleinere politieke partijen registreren we alleen donaties voor partijen die aan een specifieke drempel voldoen. De huidige drempel is vastgesteld op {count} donaties of een totaalbedrag van {sum} aan bijdragen aan die partij, ongeacht de grootte van individuele donaties.",
      source: {
        austria:
          "De hier gebruikte gegevens zijn afkomstig van de Oostenrijkse Rekenkamer en omvatten alle partijdonaties die daar sinds 2012 zijn gedocumenteerd.\n" +
          "\n" +
          "Let op: vóór 8 juli 2019 moesten politieke partijen individuele donaties van meer dan 51.000 euro (tot 2018 meer dan 50.000 euro) melden bij de ACA. Sinds juli 2019 is de rapportagegrens 2.500 euro.\n" +
          "\n" +
          "De gegevens van de partijen worden normaal gesproken elk kwartaal bijgewerkt.",
        germany:
          "De hier gebruikte gegevens zijn afkomstig van de Duitse Bondsdag en omvatten alle partijgiften van meer dan 50.000 euro die daar sinds 2010 zijn gedocumenteerd en van meer dan 35.000 euro sinds 5 maart 2024.",
        switzerland:
          "De hier gebruikte gegevens zijn afkomstig van de Zwitserse Federale Rekenkamer en omvatten alle partijgiften die daar sinds 2023 zijn gedocumenteerd.",
        netherlands:
          "De hier gepresenteerde informatie is afkomstig van de Nederlandse overheid en omvat alle politieke donaties die sinds 2022 zijn geregistreerd en meer bedragen dan €1.000, zoals gerapporteerd in het jaarlijkse „Overzicht van giften aan politieke partijen en hun neveninstellingen“.\n\nVoor het huidige jaar zijn alleen donaties opgenomen die meer bedragen dan €10.000, op basis van de dataset „Overzicht substantiële giften aan politieke partijen“.\n\nLet op: sommige donaties bevatten geen specifieke datuminformatie en zijn daarom niet opgenomen in tijdreeksen of andere datumgebaseerde visualisaties.\n\nDe donaties die voor SP en GL zijn gerapporteerd, kunnen relatief hoog lijken omdat beide partijen van hun Kamerleden en bestuurders eisen dat zij een aanzienlijk deel van hun salaris aan de partij afstaan.",
        europeanunion:
          "De hier gepresenteerde gegevens zijn afkomstig van de Autoriteit Europese Politieke Partijen en Europese Politieke Stichtingen en omvatten alle gedocumenteerde donaties van partijen en stichtingen sinds 2018. Vanwege het belang van Europese politieke stichtingen, volgen en tonen we hun donaties op dezelfde manier als die van Europese politieke partijen.\n" +
          "\n" +
          "Omdat de officiële gegevens geen gegevens bevatten, zijn er geen tijdreeksen of soortgelijke visuele weergaven beschikbaar.\n" +
          "\n" +
          "Merk op dat in de aanloop naar de Europese verkiezingen van 2024 (van 6 december 2023 tot 10 juni 2024) speciale rapportagevereisten voor donaties golden, met wekelijkse rapporten en tijdige publicatie door de autoriteit.\n" +
          "Sinds 10 juni 2024 moeten alleen donaties van meer dan 12.000 euro onmiddellijk worden gemeld. Andere donaties zijn pas beschikbaar nadat de jaarrekening is ingediend.",
        estonia:
          "De hier gebruikte gegevens zijn afkomstig van het Estse comité voor toezicht op de financiering van politieke partijen en omvatten alle politieke donaties die daar sinds 2014 zijn gedocumenteerd en die meer dan 1 euro bedragen.\n" +
          "\n" +
          "Politieke partijen in Estland zijn verplicht om elk kwartaal verslag te doen van hun inkomsten, inclusief ontvangen donaties.\n" +
          "De gegevens op de website van de commissie worden elk kwartaal dienovereenkomstig bijgewerkt.",
        czechrepublic:
          "De hier gebruikte gegevens zijn afkomstig van het Bureau voor de Controle op het Beheer van Politieke Partijen en Politieke Bewegingen en omvatten alle politieke donaties die daar sinds 2018 zijn gedocumenteerd en meer dan 25 CZK bedragen.\n" +
          "\n" +
          "Deze reikwijdte omvat ook alle bijdragen aan partijen of politieke bewegingen die ofwel meer dan 100 afzonderlijke donaties hebben ontvangen, of waarvan het totale donatiebedrag meer dan 1 miljoen CZK bedraagt, ongeacht de omvang van individuele bijdragen. De gegevens worden jaarlijks bijgewerkt.\n" +
          "Het detecteren van het donortype is gebaseerd op het identificeren van een donor als een individu wanneer zowel de velden firstName als lastName aanwezig zijn.",
        latvia:
          "De hier gebruikte gegevens zijn afkomstig van het Bureau voor Corruptiepreventie en -bestrijding en omvatten alle politieke donaties van meer dan 1 euro die daar sinds 2015 zijn gedocumenteerd.",
        australia:
          'De hier gebruikte gegevens zijn afkomstig van de Australian Electoral Commission (AEC), en specifiek uit de dataset "Donations Made Details" die de AEC publiceert. Deze bevat alle politieke donaties die daar sinds 2014 zijn vastgelegd en die meer dan €1 bedragen.\n' +
          "\n" +
          "Het is het vermelden waard dat de AEC-dataset enkele typefouten kan bevatten, waardoor bepaalde donaties mogelijk niet worden meegenomen of door inconsistenties bij de gegevensinvoer niet correct aan een specifieke partij worden toegewezen. Daarnaast worden de jaarlijkse openbaarmakingen van de AEC elk jaar op 1 februari gepubliceerd, maar de data geven geen volledig beeld van alle bijdragen vanwege de openbaarmakingsdrempel van $15.000.\n" +
          "\n" +
          "Donortypen worden geclassificeerd door donornamen te matchen. Alle gangbare vakbonden worden handmatig toegewezen aan het donortype 'Vakbond'. Bedrijven worden gedetecteerd door in de donornaam te controleren op specifieke bedrijfsidentificatoren: 'Pty' (Proprietary), 'Ltd' aan het einde van de naam, 'Corporation' of 'Corp'.",
        unitedkingdom:
          "De hier gebruikte gegevens zijn afkomstig van de Electoral Commission en omvatten alle politieke donaties die daar sinds 2010 zijn gedocumenteerd en meer dan £1.000 bedragen.\n" +
          "\n" +
          "De donatiegegevens worden elk kwartaal bijgewerkt.",
        serbia:
          "De hier gebruikte gegevens zijn niet afkomstig van de overheid, maar van de non-profitorganisatie “Center for Investigative Journalism of Serbia” (“Centar za istraživačko novinarstvo Srbije” - CINS), die zo vriendelijk is geweest om de donatiegegevens van het Servische anticorruptiebureau samen te voegen.\n" +
          "\n" +
          "Deze gegevens omvatten alle politieke donaties die daar sinds 2015 zijn gedocumenteerd.\n" +
          "\n" +
          "Aangezien de dataset geen specifieke datuminformatie geeft voor de afzonderlijke donaties, is het helaas niet mogelijk om tijdlijnen of andere op tijd gebaseerde visualisaties weer te geven.",
        croatia:
          "De hier gebruikte gegevens zijn afkomstig van de Staatsverkiezingscommissie van de Republiek Kroatië (DIP) en omvatten alle politieke donaties met een geldwaarde van meer dan €1, gedocumenteerd sinds 2019.\nDe dataset gebruikt voor elk rapportagejaar alleen het laatst gepubliceerde donatiedocument (zoals gerapporteerd door izbori) om duplicaten uit eerdere versies van het rapport van hetzelfde jaar te vermijden.\nAlle donaties worden weergegeven in euro, terwijl de onderliggende dataset tot en met 2024 kuna gebruikt. Donaties die oorspronkelijk in kuna zijn gedaan, worden omgerekend naar euro met behulp van benaderde wisselkoersen voor elk halfjaar van 2019 tot 2024: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) en H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          "De hier gebruikte gegevens zijn afkomstig van Elections Canada en zijn gebaseerd op de dataset “contributions as submitted”. Het omvat alle politieke donaties met een geldwaarde van meer dan €500, gedocumenteerd sinds 2015. Alle vermeldingen die deel uitmaken van het rapport “Statement of Contributions Received” van het verkiezingsevenement “Annual” aan “Registered parties” zijn inbegrepen.",
        georgia:
          "De hier gepresenteerde informatie is afkomstig van het Bureau voor Anti-Corruptie (ანტიკორუფციული ბიურო﻿) van Georgië en bevat alle politieke donaties die sinds 2011 zijn geregistreerd en meer dan 1 GEL bedragen. De dataset omvat alleen bijdragen die zijn geclassificeerd als type #10 (Geldelijke donaties) of type #16 (Geldelijke donaties van rechtspersonen).",
        norway:
          "De hier gebruikte gegevens zijn afkomstig uit de officiële publicaties over partijfinanciering van Statistics Norway (SSB) en Partifinansiering.no. De getoonde totalen zijn geaggregeerd uit meerdere gerapporteerde ontvangende entiteiten (zoals centrale, regionale, lokale en jongerenafdelingen) tot één totaal per partij, waarbij de onderliggende toewijzing van ontvangers beschikbaar blijft voor transparantie.\n\nDe Noorwegen-dataset wordt jaarlijks bijgewerkt en weerspiegelt daarmee het ritme van de onderliggende openbaarmakingen.",
      },
      source_link: "Gegevensbron",
    },
    list: {
      subtitle: "Wetgevende periodes",
      title: "Vorige zittingsperiodes",
      summary:
        "Ons overzicht van wetsperioden geeft een compleet overzicht van alle giften tijdens een wetsperiode.\n Klik op een kaart om de details van een specifieke zittingsperiode te bekijken.",
    },
    years: {
      title: "Jaarlijks overzicht van partijgiften",
      subtitle: "Geaggregeerde totalen in de loop van het jaar",
      more: "Toon alle andere jaren",
      summary:
        "Ons jaarlijkse overzicht van partijgiften geeft een overzicht van alle giften voor elk jaar. Klik op een kaart om naar het gedetailleerde jaaroverzicht te gaan.",
    },
    parties: {
      title: "Partijgiften",
      subtitle: "Details over individuele partijen",
      more: "Toon alle andere partijen",
      summary:
        "Ons overzicht van partijgiften toont een cumulatieve weergave van alle giften voor elke partij. Klik op een kaart voor gedetailleerde informatie over de giften.",
    },
    donors: {
      title: "Donaties van donateurs",
      subtitle: "Details over individuele donateurs",
      summary:
        "Ontdek ons overzicht van donateurs, met de meest significante financiële bijdragers sinds {minYear}. Klik op een donateur om gedetailleerde informatie over hun bijdrage te bekijken.",
    },
    stacked_years: "Donatiebedrag per jaar",
    stacked_years_subtitle:
      "Geaggregeerde som van gepubliceerde bijdragen in {country}, per jaar vanaf {years}.",
  },
  years: {
    title: "Partijgiften",
    subtitle:
      "Cumulatieve som van gepubliceerde donaties aan elke partij in {country}, {years}.",
    goto_year: "Spring naar {year}",
    no_data: {
      title: "Geen gegevens beschikbaar",
      summary:
        "Het spijt ons, maar we hebben nog geen donatiegegevens voor {year}.",
      last_year: "U kunt ook de gegevens van {year} bekijken.",
    },
  },
  overview: {
    title: "Overzicht",
    detail: {
      title: "Top politieke partijen en hun totale giften",
      summary:
        "Deze lijst toont de belangrijkste politieke partijen en hun cumulatieve giften binnen een bepaalde periode, gesorteerd op het bedrag aan giften.",
      summary2:
        "In de jaren {years} ontvingen in totaal {partyCount} partijen een totaalbedrag van {donationSum} via {donationCount} giften vanaf {minimumAmount}.",
      most_donations:
        "De {party} ontving de meeste giften met een totaal van {count} giften en een totaalbedrag van {sum}.",
      highest_sum:
        "De 5 partijen met de hoogste totale donaties zijn {parties}.",
    },
    scatter: {
      title: "Giftenverdeling",
      subtitle:
        "Individuele donaties aan elke partij, naar bedrag en frequentie, in {country} vanaf {years}.",
      summary:
        "Het overzicht van de verdeling van partijgiften geeft een beknopte analyse van de verdeling van giften over verschillende politieke partijen. Elk punt vertegenwoordigt een partij, waarbij de x-as de donatiebedragen aangeeft en de spreidingsplot de donatiefrequentie.",
      span: "De {biggestSpanParty}-partij registreerde de grootste donatiemarge, met een verschil van {biggestSpanAmount} tussen de kleinste en de grootste donatie.",
    },
    pie: {
      title: "Partijgiftenverdeling",
      subtitle:
        "Totale gepubliceerde donaties aan elke partij, {country}, {years}.",
    },
  },
  changes: {
    title: "Veranderingen",
    description:
      "Bekijk een gedetailleerde tabel van donaties aan politieke partijen in {country} uit {year}, alleen bijdragen boven {minAmount}, gesorteerd op transactiedatum, met informatie over donateur en bedrag.",
    detail: {
      title: "Partijgiften naar transactiedatum",
      summary:
        "Deze pagina toont partijgiften gesorteerd op transactiedatum, met de meest recente giften bovenaan. Er wordt informatie gegeven over hoeveel geld elke partij heeft ontvangen van welke donor.",
    },
  },
  donors: {
    title: "Donor",
    description:
      "Bekijk de volledige lijst van donoren uit {year} aan politieke partijen in {country}. Ontdek wie het meest heeft gegeven en hoeveel ieder heeft bijgedragen.",
    detail: {
      title: "Giften van gevers aan politieke partijen",
      subtitle:
        "Totale gepubliceerde bijdragen van individuele donateurs aan elke politieke partij in {country}, {years}.",
      summary:
        "De Treemap visualiseert partijdonaties in een duidelijk gestructureerde weergave. Het bovenste niveau toont de individuele donoren, die worden weergegeven door rechthoeken waarvan de grootte evenredig is met het bedrag van hun donaties.",
      summary2:
        "Onder elke donor staan rechthoeken die de respectievelijke ontvangende partijen vertegenwoordigen. Deze hiërarchische indeling biedt een snel overzicht van de verdeling van donaties en laat in één oogopslag zien hoeveel ontvangers elke donor heeft gesteund.",
      unique_donors:
        "Het aantal verschillende donoren in {years} bedraagt {count} donoren.",
      biggest_donor: "De hoogste totale donatie van {amount} kwam van {donor}.",
      most_donations:
        "Met {count} donaties (totaalbedrag: {sum}) staat {donor} bovenaan de lijst van meest voorkomende individuele donateurs.",
      most_unique_parties:
        "{donor} heeft in totaal {count} verschillende partijen gedoneerd (totaalbedrag: {sum}), wat de grootste diversiteit van donatieontvangers laat zien.",
      top_3: "In {years} zijn de top {amount} donateurs: {donors}.",
    },
    list: {
      title: "Top individuele donateurs op totaal bijdragen",
      p0: "Deze sectie toont een gerangschikte lijst van alle individuele donateurs binnen de geselecteerde jaren, gesorteerd op de cumulatieve som van hun gepubliceerde donaties. Hierdoor worden de donateurs die het meest hebben bijgedragen, benadrukt.",
    },
    sankey: {
      title: "Sankey diagram",
    },
    histogram: {
      title: "Verdeling van donoren naar aantal unieke ontvangers",
      subtitle:
        "Aantal unieke politieke partijen die gepubliceerde bijdragen hebben ontvangen van individuele donoren in {country}, {years}.",
      p0: "Deze grafiek geeft een overzicht van hoe individuele donoren hun bijdragen verdelen over politieke partijen en toont of donoren de neiging hebben hun steun op één partij te concentreren of deze in de loop der tijd over meerdere partijen te spreiden.",
      p1: "In {years} was het hoogste aantal verschillende partijen dat door één enkele donateur werd gesteund {max}. Slechts {donors} donateur droeg bij aan {max} partijen. Gemiddeld steunde elke donateur {mean} partijen (mediaan: {median}).",
      p2: "Van de {totalDonors} donoren hebben {singlePartyDonors} aan slechts één partij gedoneerd, wat neerkomt op {percentage} van de donoren.",
      tooltip: "{donors} donoren • {parties} unieke partijen",
      item: "{donors} donoren hebben aan {parties} partijen gedoneerd",
    },
  },
  timeline: {
    title: "Ontwikkeling",
    description:
      "Bekijk een tijdlijn van alle donaties aan politieke partijen in {country} voor {years}, met maandelijkse totalen en trends door de jaren heen.",
    detail: {
      title: "Ontwikkeling van partijgiften in de tijd",
      summary:
        "Bekijk de interactieve lijngrafiek hieronder om de giftenhistorie van elke politieke partij in de loop der tijd te volgen. De x-as geeft de data weer, terwijl de y-as het aantal giften weergeeft. Elke politieke partij wordt weergegeven door een aparte lijn die groeit met elke gift.",
    },
    days: "In {country} werden in {years} op {n} verschillende dagen donaties geregistreerd.",
  },
  per_year_party: {
    title: "Donaties aan {party} per jaar",
    subtitle:
      "Jaarlijkse som van gepubliceerde donaties aan {party} in {country}, {years}.",
  },
  per_month: {
    title: "Donaties per maand",
    subtitle:
      "Maandelijkse som van gepubliceerde donaties aan elke partij in {country}, {years}.",
    description:
      "Dit gestapelde staafdiagram toont maandelijkse donatiegegevens voor meerdere politieke partijen. De x-as geeft de maanden weer, de y-as de donatiebedragen en elke staaf is gesegmenteerd op kleur om de individuele partijbijdragen weer te geven, zodat de partijdonaties binnen en tussen de maanden gemakkelijk kunnen worden vergeleken.",
    highest_sum:
      "{month} had de hoogste totale donaties, met een gecombineerde telling van {count} donaties voor een bedrag van {sum}.",
    most_months:
      "{party} ontving donaties in {count} maanden, het hoogste aantal maanden met bijdragen van alle partijen.",
    month_most_donations:
      "De maand met het hoogste aantal donaties was {month}, waarin in totaal {count} individuele donaties werden ontvangen.",
  },
  party: {
    donors: {
      title: "Donateur voor {party}",
      subtitle:
        "Totale gepubliceerde bijdragen van individuele donateurs aan de {party} in {country}.",
      summary:
        "Deze pagina toont alle officieel bekendgemaakte donaties boven {minSum} aan {party} sinds {minYear}, gegroepeerd per donor om totale bijdragen over tijd te tonen. Alle cijfers zijn gebaseerd op officiële bekendmakingen gepubliceerd door {source}, getoond zowel als een treemap voor visuele vergelijking als een uitklapbare lijst van de onderliggende transacties.",
    },
    donor_types: {
      title: "Donortypes",
      treemap: {
        title: "Donortypes voor {party}",
        description:
          "Totaal gepubliceerde bijdragen aan {party} in {country} per donortype.",
      },
      p0: "Deze boomkaart groepeert gerapporteerde politieke donaties per donortype (bijvoorbeeld individuen, bedrijven en publieke fondsen) en schaalt elk vak naar het totale bedrag binnen de geselecteerde periode en scope.",
      p1: "Grotere vakken duiden op hogere bedragen, en de namen in elk vak tonen de grootste bijdragers binnen hun donortype. Deze weergave bevat {count} verschillende donortypes voor {party}.",
      p2: "Hieronder staat een lijst met sectoren gerangschikt naar hun totale bijdragen, van hoog naar laag:",
    },
    qa: {
      sum: {
        q: "Hoeveel heeft {party} aan donaties ontvangen?",
        a: "{party} heeft in totaal {sum} aan donaties ontvangen uit {count} gedocumenteerde donaties.",
      },
      top_donors: {
        q: "Wie zijn de grootste donateurs van {party}?",
        a: "De grootste donateurs van {party} zijn: {donors}.",
      },
      largest_singular: {
        q: "Wat was de grootste enkele donatie aan {party}?",
        a: "De grootste enkele donatie was {amount} van {donor} op {date}.",
      },
      biggest_overall: {
        q: "Wie is de grootste algehele donateur van {party}?",
        a: "De grootste algehele donateur van {party} is {donor} met totale donaties van {sum}.",
      },
      frequent_donor: {
        q: "Wie heeft de meeste donaties aan {party} gedaan?",
        a: "{donor} heeft de meeste donaties aan {party} gedaan met {count} afzonderlijke donaties ter waarde van in totaal {sum}.",
      },
    },
    overview: {
      title: "Overzicht van giften voor {party}",
    },
    changes: {
      detail: {
        title: "{party}-giften naar transactiedatum",
        summary:
          "Deze pagina toont een lijst van {party}-giften gesorteerd op transactiedatum, waarbij de meest recente giften bovenaan staan. Het geeft informatie over het bedrag dat elke gift vertegenwoordigt voor de {party} en de bijbehorende donateurs.",
      },
    },
    timeline: {
      chart_title: "{party}-partijgiften",
      subtitle:
        "Cumulatieve som van gepubliceerde donaties aan de {party} in {country}.",
      detail: {
        title: "Tijdsverloop van {party} giften",
        summary:
          "Verken de interactieve lijngrafiek om de donatiegeschiedenis van {party} door de tijd heen te volgen. De x-as toont de datums, terwijl de y-as het gedoneerde geldbedrag weergeeft. {party} wordt weergegeven door een eigen lijn die met elke donatie verder oploopt.",
        per_year:
          "Het totale bedrag aan donaties dat {party} ontvangt, verschilt per jaar. Hieronder vind je een historisch overzicht van de jaarlijkse financieringstotalen die door de partij zijn opgegeven. Deze lijst volgt de som van alle meldingsplichtige bijdragen en financiële steun voor elk specifiek jaar:",
      },
    },
  },
  origin: {
    title: "Oorsprong",
    description:
      "Zie waar de donaties aan politieke partijen in {country} voor {years} vandaan komen—uitsplitsing naar deelstaat en internationale bijdragen.",
    detail: {
      title: "Donatie oorsprong in een oogopslag",
      description:
        "Bekijk de transparante herkomst van politieke donaties aan {party} in {country}: uitsplitsing per staat en buitenlandse bronnen.",
      summary:
        "Krijg een duidelijk overzicht van de geografische herkomst van giften. Ontdek uit welke deelstaten of landen buiten {country} de steun afkomstig is. Volg transparant hoe giften geografisch worden verdeeld.",
      country: {
        austria:
          "In Oostenrijk wordt de herkomst van giften pas vanaf 2023 geregistreerd. Daarom kunnen alle oudere giften niet worden toegewezen aan individuele deelstaten.",
      },
      sum: "In het jaar {years} bedroegen de donaties aan politieke partijen in {country} uit binnenlandse bronnen in totaal {sumCountry}. Bijdragen uit buitenlandse bronnen bedroegen {sumOthers}.",
    },
    type: {
      map: "Kaart",
    },
    party: {
      subtitle:
        "Totale gepubliceerde donaties aan {party} per herkomststaat in {country}.",
    },
    country: {
      title: "Giften uit {country}",
      subtitle:
        "Total published donations by state of origin in {country}, {years}.",
      summary:
        "In de jaren {from} tot {until} werden giften uit {stateCount} verschillende deelstaten geregistreerd. De deelstaat met het hoogste donatiebedrag is {highestState} met {highestSum}. De meeste giften, namelijk {largesDonationCountNum}, kwamen uit {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Giften uit het buitenland",
      summary:
        "In de jaren {from} tot {until} werden giften uit {countryCount} verschillende andere landen geregistreerd. Het land met het hoogste donatiebedrag is {highestCountry} met {highestSum}. De meeste giften, namelijk {largesDonationCountNum}, kwamen uit {largesDonationCountState}.",
    },
  },
  state: {
    germany: {
      BW: "Baden-Württemberg",
      BY: "Beieren",
      BE: "Berlijn",
      BB: "Brandenburg",
      HB: "Bremen",
      HH: "Hamburg",
      HE: "Hessen",
      MV: "Mecklenburg-Voor-Pommeren",
      NI: "Nedersaksen",
      NW: "Noordrijn-Westfalen",
      RP: "Rijnland-Palts",
      SL: "Saarland",
      SN: "Saksen",
      ST: "Saksen-Anhalt",
      SH: "Sleeswijk-Holstein",
      TH: "Thüringen",
    },
    austria: {
      "1": "Burgenland",
      "2": "Karinthië",
      "3": "Neder-Oostenrijk",
      "4": "Opper-Oostenrijk",
      "5": "Salzburg",
      "6": "Stiermarken",
      "7": "Tirol",
      "8": "Vorarlberg",
      "9": "Wenen",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Nova Scotia",
      NB: "New Brunswick",
      MB: "Manitoba",
      BC: "Brits-Columbia",
      PE: "Prins Edwardeiland",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Newfoundland en Labrador",
      NT: "Northwest Territories",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  donor: {
    title: "Donaties van de donor",
    subtitle: "Totale bijdragen en ontvangers",
    active_period: "Actieve periode",
    type: "Donortype",
    summary:
      "{donor} heeft in totaal {sum} gedoneerd in {count} afzonderlijke donaties. De gemiddelde donatie bedraagt {avg}. De donaties zijn verdeeld over {parties} verschillende partijen.",
    oldest:
      "De eerste donatie na {minYear} werd gedaan op {date} met een bedrag van {amount} aan de {party}.",
    newest:
      "De meest recente donatie werd gedaan op {date}, waarbij {amount} naar de {party} ging.",
    most_donations: "De meeste donaties werden overgemaakt aan {list}.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Het jaar {biggestYear} kenmerkte zich door het hoogste totale donatiebedrag van {biggestSum}, terwijl in het jaar {mostYear} de meeste afzonderlijke donaties ({mostCount}) werden gedaan.",
    biggest:
      "De grootste individuele donatie van {amount} ging op {date} naar de {party}.",
    tree_map: "Donaties van {name}",
    tree_map_subtitle: "Total published donations to each party in {country}.",
    biggest_amounts:
      "De donaties waren voornamelijk gericht aan een selecte groep partijen. Hieronder een overzicht van ontvangers op basis van bedrag en percentage van het totaal gedoneerd:",
    table:
      "Deze sectie biedt een uitgebreid overzicht van alle individuele donaties van {donor}. U kunt de tabel sorteren op datum, partij of bedrag om gemakkelijk te onderzoeken hoe de donaties over de tijd en ontvangers zijn verdeeld. Deze gedetailleerde weergave maakt transparante tracking van elke bijdrage mogelijk en biedt diepgaand inzicht in het geefgedrag van de donateur.",

    timeline: {
      title: "Donatieopbouw in de tijd",
      p0: "In dit gedeelte wordt getoond hoe donaties van {donor} sinds {year} aan verschillende politieke partijen in de loop der tijd zijn veranderd. De grafiek visualiseert het totaal gedoneerde bedrag, waarbij het aandeel van elke partij wordt benadrukt, zodat eenvoudig te zien is wanneer en waar de steun naartoe ging.",
      p1: "Volg de lijnen om patronen, pieken of verschuivingen in het donatiegedrag te ontdekken. Dit overzicht biedt een transparant beeld van hoe de bijdragen van één donateur over het politieke landschap zijn verdeeld.",
      years:
        "Donaties zijn door de jaren heen gevarieerd. Hieronder ziet u de totale donatiebedragen per jaar, inclusief het percentage dat elk jaar bijdraagt aan de totale donaties van deze donor.",
      chart_subtitle:
        "Cumulatieve donaties van {donor} aan politieke partijen in {country}, weergegeven naar bedrag en datum sinds {minYear}.",
    },

    anonymized: {
      title: "Record geanonimiseerd",
      description:
        "De persoonlijke identiteit die aan deze donatie is gekoppeld, is verwijderd in overeenstemming met een geldig AVG-verzoek. Het donatiebedrag blijft opgenomen in de totale financieringsberekeningen om financiële transparantie te waarborgen.",
    },

    redacted: {
      title: "Record geredigeerd",
      description:
        "De identiteit van de donor is door de publicerende instantie geredigeerd vóór de publicatie van deze gegevens. Het donatiebedrag blijft opgenomen in de berekeningen van de totale financiering om financiële transparantie te waarborgen.",
    },
    ubo: "Uiteindelijk belanghebbenden (UBO's)",
    ubo_description:
      'Een Uiteindelijk Belanghebbende (UBO) is de persoon die feitelijk aan de touwtjes trekt. Het zijn de individuen die uiteindelijk de donor bezitten of controleren, doorgaans door 25% of meer van de aandelen of stemrechten te houden. Als geen enkele persoon aan deze drempel voldoet, kan het hoger management (zoals directeuren) worden vermeld als "pseudo-UBO\'s" om verantwoordelijkheid te waarborgen.',
  },
  countries: {
    "??": "Niet gespecificeerd",
    DE: "Duitsland",
    DK: "Denemarken",
    CH: "Zwitserland",
    TH: "Thailand",
    AT: "Oostenrijk",
    UK: "Verenigd Koninkrijk",
    NL: "Nederland",
    EU: "Europese Unie",
    LV: "Letland",
    ES: "Spanje",
    FI: "Finland",
    HR: "Kroatië",
    BE: "België",
    LU: "Luxemburg",
    SI: "Slovenië",
    EE: "Estland",
    FR: "Frankrijk",
    IE: "Ierland",
    IT: "Italië",
    PL: "Polen",
    RO: "Roemenië",
    CY: "Cyprus",
    MT: "Malta",
    PT: "Portugal",
    LT: "Litouwen",
    HU: "Hongarije",
    CZ: "Tsjechië",
    SG: "Singapore",
    MC: "Monaco",
    SE: "Zweden",

    AD: "Andorra",
    IM: "Eiland Man",
    NO: "Noorwegen",
    LI: "Liechtenstein",
    MK: "Macedonië",
    AL: "Albanië",
    MD: "Moldavië",
    SM: "San Marino",
    FO: "Faeröer",
    BA: "Bosnië en Herzegovina",
    ME: "Montenegro",
    BG: "Bulgarije",
    BY: "Belarus",
    GR: "Griekenland",
    IS: "IJsland",
    SK: "Slowakije",
    UA: "Oekraïne",
    GB: "Verenigd Koninkrijk",
    RS: "Servië",
    AU: "Australië",
    ZA: "Zuid-Afrika",
    US: "Verenigde Staten",
    CA: "Canada",
    GE: "Georgië",
    NZ: "Nieuw-Zeeland",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Duitsland",
    DK: "Denemarken",
    CH: "Zwitserland",
    TH: "Thailand",
    AT: "Oostenrijk",
    UK: "Verenigd Koninkrijk",
    NL: "Nederland",
    EU: "Europese Unie",
    LV: "Letland",
    ES: "Spanje",
    FI: "Finland",
    HR: "Kroatië",
    BE: "België",
    LU: "Luxemburg",
    SI: "Slovenië",
    EE: "Estland",
    FR: "Frankrijk",
    IE: "Ierland",
    IT: "Italië",
    PL: "Polen",
    RO: "Roemenië",
    CY: "Cyprus",
    CZ: "Tsjechië",
    AU: "Australië",
    RS: "Servië",
    CA: "Canada",
    GE: "Georgië",
    NO: "Noorwegen",
  },
  about: {
    title: "Over ons",
    description: {
      p0: "DonationWatch is ontstaan uit het gebrek aan leesbaarheid van gegevens op de officiële website van de Duitse Bondsdag.",
      p1: "Ons doel is om dit te verbeteren door alleen publiek beschikbare gegevens te gebruiken en deze effectiever te presenteren.",
      p2: "We realiseerden ons dat landen als Oostenrijk, Zwitserland en Nederland partijgiften op verschillende manieren publiceren. Om een gestandaardiseerde interface te creëren die de toegang tot deze gegevens vereenvoudigt, hebben we deze landen opgenomen in ons project. Andere landen zullen volgen zodra we de relevante gegevens kunnen vinden en verwerken.",
      p3: "Als je suggesties of feedback hebt, aarzel dan niet om",
      mail: "contact met ons op te nemen",
    },
    source:
      "Alle gevisualiseerde informatie komt uitsluitend uit openbaar beschikbare overheidsbronnen en bevat geen voorheen niet vrijgegeven gegevens of privéregistraties. Transparantie is onze basis.",
  },
  imprint: {
    title: "Imprint",
  },
  privacy: {
    title: "Gegevensbeveiliging",
    last_updated: "Laatst bijgewerkt: {date}",
    effective_date: "Ingangsdatum: {date}",
    data: {
      title: "1. Gegevensverzameling",
      p: "We verzamelen geen persoonlijke gegevens van bezoekers van onze website. Dit omvat:",
      li0: "Geen registratieformulieren",
      li1: "Geen nieuwsbriefaanmeldingen",
      li2: "Geen gebruikersaccounts",
      li3: "Geen cookies voor trackingdoeleinden",
    },
    cf: {
      title: "2. Cloudflare-diensten",
      link: "Bekijk Cloudflare's privacybeleid",
      p: "We gebruiken twee Cloudflare-diensten:",
      workers: {
        summary:
          "Cloudflare Workers: Serverloos platform voor contentlevering (geen verwerking van gebruikersgegevens)",
      },
      analytics: {
        summary: "Cloudflare Web Analytics: Privacyvriendelijke analytics die:",
        li0: "Geen cookies gebruikt",
        li1: "Alleen geaggregeerde statistieken verzamelt",
      },
    },
    logs: {
      title: "3. Automatische serverlogs",
      p: "Onze hostingprovider kan verzamelen:",
      li0: "IP-adressen (geanonimiseerd)",
      li1: "Tijdstempels van verzoeken",
      li2: "Browser/apparaattypen",
      retention: "Deze gegevens worden automatisch binnen 7 dagen verwijderd.",
    },
    contact: {
      title: "Contact",
      p: "Voor privacyvragen:",
    },
  },
  fun: {
    link: "Leuke feiten",
    title: "Leuke weetjes over openbare gegevens",
    p0: "Deze pagina toont interessante bevindingen uit ons werk met openbaar gemaakte overheidsgegevens. Deze observaties zijn geen kritiek, maar eerder kleine eigenaardigheden die in elke grote dataset kunnen voorkomen.",
    p1: "Hoewel we problemen melden wanneer dat gepast is, beschouwen we ze niet als dringende zaken die overheidsinstanties moeten aanpakken. Uit onze ervaring blijkt dat deze organisaties ontvankelijk en open zijn voor feedback.",
    reported_fixed: "Dit werd gemeld aan {owner} en door hen gecorrigeerd.",
    reported_wontfix:
      "Dit is gemeld aan {owner} en ze kunnen het niet veranderen.",
    reported: "Dit is gemeld aan {owner}.",
  },
  transparency: {
    title: "Transparantie",
    p0: "We streven ernaar om duidelijke en consistente informatie te geven over donateurs van politieke partijen. Om dit te bereiken normaliseren we automatisch bepaalde donornamen om uniformiteit in onze database te garanderen. Deze aanpak stelt ons in staat om de nauwkeurigheid te behouden en tegelijkertijd rekening te houden met verschillen in de manier waarop namen worden geregistreerd.",
    p1: "In het belang van transparantie hebben we een lijst samengesteld van genormaliseerde namen en hun variaties die we in onze donatiegegevens zijn tegengekomen. Hieronder vindt u elke genormaliseerde naam, gevolgd door de variaties ervan. Deze lijst helpt verklaren waarom u donateursnamen ziet die niet precies zo in onze brondocumenten voorkomen.",
    section: {
      filtered_donors: "Gefilterde donateurs",
      filtered_receivers: "Gefilterde ontvangers",
      aggregated: "Geaggregeerde donateurs",
    },
    filtered_donors: {
      p0: "Om de werkelijke bronnen van politieke donaties nauwkeurig weer te geven, filteren we bepaalde transacties weg die in feite overheidsbijdragen zijn in plaats van echte donaties. Omdat onze brondatasets deze niet expliciet labelen, gebruiken we een set filterregels op basis van reguliere expressies (regexp) om dergelijke vermeldingen automatisch te identificeren en te verwijderen. Hieronder kunt u de volledige lijst met toegepaste regexp-filterregels bekijken.",
      p1: "Hieronder staat een lijst met donateurs waarvan de bijdragen volgens onze criteria en filterregels zijn uitgefilterd.",
    },
    filtered_receivers: {
      p0: "Om ervoor te zorgen dat we alleen zinvolle ontvangersgegevens presenteren, filteren we ook bepaalde ontvangers of partijen weg die voor het volgen van donateurs als irrelevant of niet-operationeel worden beschouwd. Omdat onze datasets deze ontvangers niet altijd expliciet labelen, passen we een set regels op basis van regexp toe om ze automatisch uit te sluiten.",
      p1: "Hieronder kunt u de volledige lijst met toegepaste regexp-filterregels bekijken.",
    },
    receivers: {
      title: "Geaggregeerde ontvangers",
      p0: "In {country} kunnen donaties worden gerapporteerd aan verschillende organisatorische onderdelen binnen een partij. Voor consistentie voegen we verwante ontvanger-entiteiten samen tot één totaal op partijniveau. De onderstaande lijst laat zien welke ontvanger-entiteiten per partij worden geaggregeerd.",
    },
  },
  related: {
    donors: "Vergelijkbare donoren",
  },
  similar_donors: {
    title: "Netwerk van vergelijkbare donateurs",
    description:
      "Ontdek het bredere donatienetwerk dat met deze donateur verbonden is.",
    summary:
      "In het gerelateerde donatienetwerk zijn er {count} unieke donateurs.",
    list_title: "Overzicht partijverdeling",
  },

  detect_country: {
    title: "Het lijkt erop dat je in {country} bent.",
    description: "Tik om politieke donaties in {country} te verkennen.",
    action: "Bekijk donaties voor {country}",
  },

  donor_type: {
    [DonorType.PublicFund]: "Openbaar fonds",
    [DonorType.Individual]: "Individu",
    [DonorType.Company]: "Bedrijf",
    [DonorType.Other]: "Overig",
    [DonorType.TradeUnion]: "Vakbond",
    [DonorType.UnincorporatedAssociation]: "Niet-geregistreerde vereniging",
    [DonorType.RegisteredPoliticalParty]: "Geregistreerde politieke partij",
    [DonorType.Trust]: "Trust",
    [DonorType.FriendlySociety]: "Onderlinge vereniging",
    [DonorType.LimitedLiabilityPartnership]:
      "Vennootschap met beperkte aansprakelijkheid",
    [DonorType.BuildingSociety]: "Bouwvereniging",
    [DonorType.NonProfitLegalEntity]: "Niet-winstgevende rechtspersoon",
    [DonorType.AnonymizedDonor]: "Geanonimiseerde donor",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Andere landen",
  },

  thanks:
    "Met dank aan organisaties zoals {external} voor het verstrekken van waardevolle informatie over mechanismen voor politieke donaties.",

  export: {
    title: "Gegevensexport",
    p0: "Download de volledige dataset met politieke donaties voor {country} die op deze site wordt gebruikt. De export bevat genormaliseerde donornamen, bedragen, datums en ontvangende partijen.",
    p1: "Belangrijk: Dit zijn niet de ruwe gegevens van {source}. Deze dataset bevat alleen donaties die door ons team zijn genormaliseerd en gefilterd. Bekijk onze sectie {transparency} voor de methodiek.",
    license: "Licentie: {license}",
    download: "{format} downloaden",
    includes_donations: "{num} donaties inbegrepen",
  },
  bar_chart_race: {
    title: "Balkengrafiek-race",
    description:
      "Visualiseer de cumulatie van donaties in de loop van de tijd. Selecteer een jaarrange om te zien hoe partijfinanciering zich dynamisch ontwikkelt.",
    from: "Van",
    to: "Tot",
    download_video: "Video downloaden",
    rendering: "Renderen... {percentage}",
    no_data: "Geen gegevens beschikbaar voor het geselecteerde bereik.",
    note: "Let op: Deze animatie wordt client-side in je browser gerenderd en kan op sommige apparaten veel systeembronnen gebruiken. Het downloaden van de video speelt automatisch de volledige animatie af.",
    individual_years: "Afzonderlijke jaren",
    animation_duration: "Animatieduur",
    duration_s: "{seconds}s",
    group_by: {
      label: "Groeperen op",
      receiver: "Partij",
      donor: "Donor",
    },
  },
};

export default Nl;
